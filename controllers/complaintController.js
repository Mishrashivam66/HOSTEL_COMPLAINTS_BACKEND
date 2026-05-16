const Complaint = require("../models/Complaint");

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
    const { hostel, floor, room, phoneNumber, category, description } =
      req.body;

    if (!hostel || !floor || !room || !phoneNumber || !category) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    // Auto 24h deadline
    const deadline = new Date();

    deadline.setHours(deadline.getHours() + 24);

    const complaint = await Complaint.create({
      studentId: req.user.id,

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

    // ============================
    // STUDENT NOTIFICATION
    // ============================

    await sendStudentNotification(
      `✅ Complaint Registered

Hostel: ${hostel}
Room: ${room}

Category:
${category}

Status:
Pending`,
    );

    // ============================
    // WORKER NOTIFICATION
    // ============================

    await sendWorkerNotification(
      `🚨 NEW COMPLAINT

Hostel: ${hostel}
Room: ${room}

Category:
${category}

Description:
${description}`,
    );

    res.status(201).json({
      message: "Complaint submitted successfully",

      complaint,
    });
  } catch (error) {
    res.status(500).json({
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
      studentId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({
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
      status: { $ne: "Completed" },
    })

      .populate("studentId", "name email")

      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// WORKER → ACCEPT COMPLAINT
// =====================================

exports.acceptComplaint = async (req, res) => {
  try {
    // const currentHour = new Date().getHours();

    // if (currentHour < 9 || currentHour >= 17) {

    //   return res.status(403).json({
    //     message: "Worker service available only between 9 AM and 5 PM"
    //   });

    // }

    const { visitTime } = req.body;

    if (!visitTime) {
      return res.status(400).json({
        message: "Visit time is required",
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
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

    // ============================
    // STUDENT NOTIFICATION
    // ============================

    await sendStudentNotification(
      `👨‍🔧 Worker Assigned

Visit Time:
${visitTime}

Status:
In Progress

Please remain available in your room.`,
    );

    res.status(200).json({
      message: "Complaint accepted successfully",

      complaint,
    });
  } catch (error) {
    res.status(500).json({
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
        message: "Complaint not found",
      });
    }

    const allowedStatus = ["Pending", "Assigned", "In Progress", "Completed"];
    if (!allowedStatus.includes(req.body.status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    complaint.status = req.body.status;

    if (req.body.status === "Completed") {
      complaint.completedAt = new Date();

      await sendStudentNotification(
        `✅ Complaint Resolved

Your complaint has been marked completed.

Thank you for using Hostel Complaint System.`,
      );
    }

    await complaint.save();

    res.status(200).json({
      message: "Complaint status updated successfully",

      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// ADMIN → ALL COMPLAINTS
// =====================================

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()

      .populate("studentId", "name email")

      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// ADMIN → ESCALATED COMPLAINTS
// =====================================

exports.getEscalatedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      isEscalated: true,
    })

      .populate("studentId", "name email")

      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// ADMIN → STATS
// =====================================

exports.getAdminStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();

    const pending = await Complaint.countDocuments({
      status: "Pending",
    });

    const inProgress = await Complaint.countDocuments({
      status: "In Progress",
    });

    const completed = await Complaint.countDocuments({
      status: "Completed",
    });

    res.status(200).json({
      totalComplaints,
      pending,
      inProgress,
      completed,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// HOSTEL STATS
// =====================================

exports.getHostelStats = async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: "$hostel",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================
// CATEGORY STATS
// =====================================

exports.getCategoryStats = async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
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
      status: { $ne: "Completed" },

      completionDeadline: {
        $lt: new Date(),
      },

      isEscalated: false,
    });

    for (const complaint of overdueComplaints) {
      complaint.isEscalated = true;

      await complaint.save();

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

      console.log(`Complaint Escalated: ${complaint._id}`);
    }
  } catch (error) {
    console.log(error.message);
  }
};
