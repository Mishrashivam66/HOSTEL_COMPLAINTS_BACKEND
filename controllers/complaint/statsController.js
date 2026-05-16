const Complaint = require(
  "../../models/Complaint"
);

const {
  sendAdminNotification
} = require(
  "../../services/telegramService"
);

// =====================================
// ADMIN STATS
// =====================================

exports.getAdminStats =
  async (req, res) => {

    try {

      const totalComplaints =
        await Complaint.countDocuments();

      const pending =
        await Complaint.countDocuments({

          status: "Pending"

        });

      const inProgress =
        await Complaint.countDocuments({

          status: "In Progress"

        });

      const completed =
        await Complaint.countDocuments({

          status: "Completed"

        });

      res.status(200).json({

        totalComplaints,

        pending,

        inProgress,

        completed

      });

    } catch (error) {

      res.status(500).json({

        message: error.message

      });

    }

  };

// =====================================
// HOSTEL STATS
// =====================================

exports.getHostelStats =
  async (req, res) => {

    try {

      const stats =
        await Complaint.aggregate([

          {

            $group: {

              _id: "$hostel",

              count: {
                $sum: 1
              }

            }

          }

        ]);

      res.status(200).json(
        stats
      );

    } catch (error) {

      res.status(500).json({

        message: error.message

      });

    }

  };

// =====================================
// CATEGORY STATS
// =====================================

exports.getCategoryStats =
  async (req, res) => {

    try {

      const stats =
        await Complaint.aggregate([

          {

            $group: {

              _id: "$category",

              count: {
                $sum: 1
              }

            }

          }

        ]);

      res.status(200).json(
        stats
      );

    } catch (error) {

      res.status(500).json({

        message: error.message

      });

    }

  };

// =====================================
// ESCALATION CHECKER
// =====================================

exports.checkEscalatedComplaints =
  async () => {

    try {

      const overdueComplaints =
        await Complaint.find({

          status: {
            $ne: "Completed"
          },

          completionDeadline: {
            $lt: new Date()
          },

          isEscalated: false

        });

      for (
        const complaint
        of overdueComplaints
      ) {

        complaint.isEscalated =
          true;

        await complaint.save();

        await sendAdminNotification(

`⚠️ Complaint Escalated

Hostel:
${complaint.hostel}

Room:
${complaint.room}

Category:
${complaint.category}

Complaint pending more than 24 hours.`

        );

        console.log(

          `Complaint Escalated:
${complaint._id}`

        );

      }

    } catch (error) {

      console.log(
        error.message
      );

    }

  };