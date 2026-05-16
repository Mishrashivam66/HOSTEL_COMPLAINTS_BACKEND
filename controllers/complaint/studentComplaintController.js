const Complaint = require(
  "../../models/Complaint"
);

// =====================================
// GET MY COMPLAINTS
// =====================================

exports.getMyComplaints =
  async (req, res) => {

    try {

      const complaints =
        await Complaint.find({

          studentId:
            req.user._id,

        }).sort({

          createdAt: -1,

        });

      res.status(200).json({

        success: true,

        complaints,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

  };

// =====================================
// GET SINGLE COMPLAINT
// =====================================

exports.getSingleComplaint =
  async (req, res) => {

    try {

      const complaint =
        await Complaint.findById(

          req.params.id

        );

      if (!complaint) {

        return res.status(404).json({

          message:
            "Complaint not found",

        });

      }

      res.status(200).json({

        success: true,

        complaint,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

  };