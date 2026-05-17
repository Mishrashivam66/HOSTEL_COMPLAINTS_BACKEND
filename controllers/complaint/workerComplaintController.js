const Complaint = require(
  "../../models/Complaint"
);

const Notification = require(
  "../../models/Notification"
);

const {
  sendStudentNotification
} = require(
  "../../services/telegramService"
);

// =====================================
// WORKER COMPLAINTS
// =====================================

exports.getWorkerComplaints =
  async (req, res) => {

    try {

      const complaints =
        await Complaint.find({

          status: {
            $ne: "Completed"
          }

        })

        .populate(
          "studentId",
          "name email"
        )

        .sort({

          createdAt: -1

        });

      res.status(200).json(
        complaints
      );

    }

    catch (error) {

      res.status(500).json({

        message:
          error.message

      });

    }

  };

// =====================================
// ACCEPT COMPLAINT
// =====================================

exports.acceptComplaint =
  async (req, res) => {

    try {

      const {
        visitTime
      } = req.body;

      if (!visitTime) {

        return res.status(400).json({

          message:
            "Visit time is required"

        });

      }

      const complaint =
        await Complaint.findById(

          req.params.id

        );

      if (!complaint) {

        return res.status(404).json({

          message:
            "Complaint not found"

        });

      }

      complaint.workerAccepted =
        true;

      complaint.visitTime =
        visitTime;

      complaint.acceptedAt =
        new Date();

      complaint.status =
        "In Progress";

      await complaint.save();

      // =====================================
      // TELEGRAM NOTIFICATION
      // =====================================

      await sendStudentNotification(

`👨‍🔧 Worker Assigned

Visit Time:
${visitTime}

Status:
In Progress`

      );

      // =====================================
      // DATABASE NOTIFICATION
      // =====================================

      await Notification.create({

        userId:
          complaint.studentId,

        title:
          "Worker Accepted Complaint",

        message:
          "Worker accepted your complaint and started work",

        type:
          "accepted",

        isRead:
          false,

      });

      res.status(200).json({

        message:
          "Complaint accepted successfully",

        complaint

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message

      });

    }

  };

// =====================================
// UPDATE STATUS
// =====================================

exports.updateComplaintStatus =
  async (req, res) => {

    try {

      const complaint =
        await Complaint.findById(

          req.params.id

        );

      if (!complaint) {

        return res.status(404).json({

          message:
            "Complaint not found"

        });

      }

      const allowedStatus = [

        "Pending",

        "In Progress",

        "Completed"

      ];

      if (

        !allowedStatus.includes(

          req.body.status

        )

      ) {

        return res.status(400).json({

          message:
            "Invalid status value"

        });

      }

      complaint.status =
        req.body.status;

      // =====================================
      // COMPLETED
      // =====================================

      if (

        req.body.status ===
        "Completed"

      ) {

        complaint.completedAt =
          new Date();

        // TELEGRAM

        await sendStudentNotification(

`✅ Complaint Resolved

Your complaint has been completed.`

        );

        // DATABASE NOTIFICATION

        await Notification.create({

          userId:
            complaint.studentId,

          title:
            "Complaint Completed",

          message:
            "Your complaint has been resolved successfully",

          type:
            "completed",

          isRead:
            false,

        });

      }

      await complaint.save();

      res.status(200).json({

        message:
          "Complaint status updated successfully",

        complaint

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message

      });

    }

  };