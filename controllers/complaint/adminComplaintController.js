const Complaint = require(
  "../../models/Complaint"
);

// =====================================
// ALL COMPLAINTS
// =====================================

exports.getAllComplaints =
  async (req, res) => {

    try {

      const complaints =
        await Complaint.find()

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

    } catch (error) {

      res.status(500).json({

        message: error.message

      });

    }

  };

// =====================================
// ESCALATED
// =====================================

exports.getEscalatedComplaints =
  async (req, res) => {

    try {

      const complaints =
        await Complaint.find({

          isEscalated: true

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

    } catch (error) {

      res.status(500).json({

        message: error.message

      });

    }

  };