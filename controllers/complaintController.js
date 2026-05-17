const Complaint = require("../models/Complaint");

const Notification = require("../models/Notification");

const {
  sendStudentNotification,
  sendWorkerNotification,
  sendAdminNotification,
} = require("../services/telegramService");

// =====================================
// CREATE COMPLAINT
// =====================================

exports.createComplaint = async (req, res) => {
  try {
    const {
      hostel,
      floor,
      room,

      phoneNumber,

      category,
      description,
    } = req.body;

    // =====================================
    // VALIDATION
    // =====================================

    if (!hostel || !floor || !room || !phoneNumber || !category) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    // =====================================
    // AUTO 24H DEADLINE
    // =====================================

    const deadline = new Date();

    deadline.setHours(deadline.getHours() + 24);

    // =====================================
    // CREATE COMPLAINT
    // =====================================

    const complaint = await Complaint.create({
      studentId: req.user._id,

      hostel,
      floor,
      room,

      phoneNumber,

      category,
      description,

      status: "Pending",

      priority: "Medium",

      assignedWorker: "",

      workerPhone: "",

      isEscalated: false,

      completionDeadline: deadline,
    });

    // =====================================
    // TELEGRAM STUDENT NOTIFICATION
    // =====================================

    await sendStudentNotification(
      `✅ Complaint Registered

Hostel: ${hostel}
Room: ${room}

Category:
${category}

Status:
Pending`,
    );

    // =====================================
    // DATABASE NOTIFICATION
    // =====================================

    await Notification.create({
      userId: req.user._id,

      title: "Complaint Submitted",

      message: "Your complaint has been submitted successfully",

      type: "submitted",
    });

    // =====================================
    // WORKER TELEGRAM NOTIFICATION
    // =====================================

    await sendWorkerNotification(
      `🚨 NEW COMPLAINT

Hostel: ${hostel}
Room: ${room}

Category:
${category}

Description:
${description}`,
    );

    // =====================================
    // RESPONSE
    // =====================================

    res.status(201).json({
      success: true,

      message: "Complaint submitted successfully",

      complaint,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================
// STUDENT → MY COMPLAINTS
// =====================================

exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      studentId: req.user._id,
    })

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,

      complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================
// WORKER → ACTIVE COMPLAINTS
// =====================================

exports.getWorkerComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      status: {
        $ne: "Completed",
      },
    })

      .populate(
        "studentId",

        "name email",
      )

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,

      complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================
// WORKER → ACCEPT COMPLAINT
// =====================================

exports.acceptComplaint = async (req, res) => {
  try {
    const { visitTime } = req.body;

    if (!visitTime) {
      return res.status(400).json({
        success: false,

        message: "Visit time is required",
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,

        message: "Complaint not found",
      });
    }

    complaint.workerAccepted = true;

    complaint.assignedWorker = req.user.name || req.user.firstName;

    complaint.workerPhone = req.user.phoneNumber || "";

    complaint.visitTime = visitTime;

    complaint.acceptedAt = new Date();

    complaint.status = "Assigned";

    await complaint.save();

    // =====================================
    // TELEGRAM STUDENT NOTIFICATION
    // =====================================

    await sendStudentNotification(
      `👨‍🔧 Worker Assigned

Visit Time:
${visitTime}

Status:
In Progress

Please remain available in your room.`,
    );

    // =====================================
    // DATABASE NOTIFICATION
    // =====================================

    await Notification.create({
      userId: complaint.studentId,

      title: "Worker Accepted Complaint",

      message: `${complaint.assignedWorker} accepted your complaint`,

      type: "accepted",
    });

    res.status(200).json({
      success: true,

      message: "Complaint accepted successfully",

      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================
// WORKER → UPDATE STATUS
// =====================================

exports.updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,

        message: "Complaint not found",
      });
    }

    const allowedStatus = ["Pending", "Assigned", "In Progress", "Completed"];

    if (!allowedStatus.includes(req.body.status)) {
      return res.status(400).json({
        success: false,

        message: "Invalid status value",
      });
    }

    complaint.status = req.body.status;

    // =====================================
    // COMPLETED
    // =====================================

    if (req.body.status === "Completed") {
      complaint.completedAt = new Date();

      // TELEGRAM

      await sendStudentNotification(
        `✅ Complaint Resolved

Your complaint has been marked completed.

Thank you for using Hostel Complaint System.`,
      );

      // DATABASE

      await Notification.create({
        userId: complaint.studentId,

        title: "Complaint Completed",

        message: "Your complaint has been resolved successfully",

        type: "completed",
      });
    }

    await complaint.save();

    res.status(200).json({
      success: true,

      message: "Complaint status updated successfully",

      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// =====================================
// ESCALATION CHECKER
// =====================================

exports.checkEscalatedComplaints = async () => {
  try {
    const overdueComplaints = await Complaint.find({
      status: {
        $ne: "Completed",
      },

      completionDeadline: {
        $lt: new Date(),
      },

      isEscalated: false,
    });

    for (const complaint of overdueComplaints) {
      complaint.isEscalated = true;

      await complaint.save();

      // TELEGRAM

      await sendAdminNotification(
        `⚠️ Complaint Escalated

Hostel:
${complaint.hostel}

Room:
${complaint.room}

Category:
${complaint.category}

Complaint pending more than 24 hours.`,
      );

      // DATABASE

      await Notification.create({
        userId: complaint.studentId,

        title: "Complaint Escalated",

        message: "Your complaint has been escalated to admin",

        type: "escalated",
      });

      console.log(`Complaint Escalated: ${complaint._id}`);
    }
  } catch (error) {
    console.log(error.message);
  }
};
