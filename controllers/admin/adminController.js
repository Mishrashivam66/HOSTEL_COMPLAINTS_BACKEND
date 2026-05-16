const Complaint = require("../../models/Complaint");

const User = require("../../models/User");
const Notification = require("../../models/Notification");

// ======================
// GET PENDING USERS
// ======================

exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({
      isApproved: false,

      role: {
        $ne: "admin",
      },
    })

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,

      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ======================
// APPROVE USER
// ======================

exports.approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User not found",
      });
    }

    user.isApproved = true;

    await user.save();

    res.status(200).json({
      success: true,

      message: "User approved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ======================
// GET ALL COMPLAINTS
// ======================

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()

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

// ======================
// HOSTEL WISE STUDENTS
// ======================

exports.getHostelStudentStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $match: {
          role: "student",

          isApproved: true,
        },
      },

      {
        $group: {
          _id: "$hostel",

          totalStudents: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          totalStudents: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,

      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ======================
// HOSTEL WISE COMPLAINTS
// ======================

exports.getHostelComplaintStats = async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: "$hostel",

          totalComplaints: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          totalComplaints: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,

      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ======================
// ADMIN DASHBOARD STATS
// ======================

exports.getDashboardStats = async (req, res) => {
  try {
    // ======================
    // TOTALS
    // ======================

    const totalComplaints = await Complaint.countDocuments();

    const totalStudents = await User.countDocuments({
      role: "student",

      isApproved: true,
    });

    const totalWorkers = await User.countDocuments({
      role: "worker",

      isApproved: true,
    });

    // ======================
    // STATUS COUNTS
    // ======================

    const pendingComplaints = await Complaint.countDocuments({
      status: "Pending",
    });

    const assignedComplaints = await Complaint.countDocuments({
      status: "Assigned",
    });

    const completedComplaints = await Complaint.countDocuments({
      status: "Completed",
    });

    // ======================
    // ESCALATED
    // ======================

    const overdueComplaints = await Complaint.countDocuments({
      isEscalated: true,
    });

    // ======================
    // TODAY
    // ======================

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayComplaints = await Complaint.countDocuments({
      createdAt: {
        $gte: today,
      },
    });

    // ======================
    // MONTH
    // ======================

    const currentMonth = new Date().getMonth();

    const currentYear = new Date().getFullYear();

    const monthlyComplaints = await Complaint.countDocuments({
      createdAt: {
        $gte: new Date(
          currentYear,

          currentMonth,

          1,
        ),
      },
    });

    // ======================
    // RESPONSE
    // ======================

    res.status(200).json({
      success: true,

      stats: {
        totalComplaints,

        totalStudents,

        totalWorkers,

        pendingComplaints,

        assignedComplaints,

        completedComplaints,

        overdueComplaints,

        todayComplaints,

        monthlyComplaints,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ======================
// GET OVERDUE COMPLAINTS
exports.getOverdueComplaints = async (req, res) => {
  try {
    // ======================
    // CURRENT TIME
    // ======================

    const now = new Date();

    // ======================
    // FIND OVERDUE
    // ======================

    const complaints = await Complaint.find({
      status: {
        $ne: "Completed",
      },

      completionDeadline: {
        $lt: now,
      },
    })

      .sort({
        completionDeadline: 1,
      });

    // ======================
    // ESCALATE + NOTIFICATION
    // ======================

    for (let complaint of complaints) {
      // ONLY ONCE

      if (!complaint.isEscalated) {
        // ======================
        // ESCALATE
        // ======================

        complaint.isEscalated = true;

        await complaint.save();
        // ======================
        // CREATE NOTIFICATION
        // ======================

        await Notification.create({
          title: "Overdue Complaint",

          message: `Complaint ${complaint.complaintId} has exceeded 24 hours.`,

          complaintId: complaint.complaintId,
        });

        // ======================
        // CREATE NOTIFICATION
        // ======================

        await Notification.create({
          title: "Overdue Complaint",

          message: `${complaint.complaintId} is overdue in ${complaint.hostel}`,

          type: "danger",
        });
      }
    }

    // ======================
    // RESPONSE
    // ======================

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

// ======================
// GET NOTIFICATIONS
// ======================

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,

      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ======================
// MARK AS READ
// ======================

exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,

        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      success: true,

      message: "Notification updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ======================
// GET ALL STUDENTS
// ======================

exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
    })

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,

      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ======================
// GET ALL WORKERS
// ======================

exports.getAllWorkers = async (req, res) => {
  try {
    const workers = await User.find({
      role: "worker",
    })

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,

      workers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ======================
// GET ALL COMPLAINTS
// ======================

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()

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

// ======================
// CHECK OVERDUE
// ======================

exports.checkOverdueComplaints = async () => {
  try {
    const now = new Date();

    const complaints = await Complaint.find({
      status: {
        $ne: "Completed",
      },

      completionDeadline: {
        $lt: now,
      },

      isEscalated: false,
    });

    for (let complaint of complaints) {
      complaint.isEscalated = true;

      await complaint.save();

      console.log(`Escalated: ${complaint.complaintId}`);
    }
  } catch (error) {
    console.log(error);
  }
};
// ======================
// GET NOTIFICATIONS
// ======================

exports.getNotifications =
async (req, res) => {

  try {

    const notifications =
      await Notification.find()

      .sort({

        createdAt: -1,

      });

    res.status(200).json({

      success: true,

      notifications,

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};


