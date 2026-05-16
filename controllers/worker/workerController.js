const Complaint =
require("../../models/Complaint");

// ======================
// GET ALL COMPLAINTS
// ======================

exports.getOpenComplaints =
async (req, res) => {

  try {

    const complaints =
      await Complaint.find({

        status: {

          $in: [

            "Pending",

            "In Progress",

            "Completed",

          ],

        },

      })

      .sort({

        createdAt: -1,

      });

    res.status(200).json({

      success: true,

      complaints,

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

// ======================
// ACCEPT COMPLAINT
// ======================

exports.acceptComplaint =
async (req, res) => {

  try {

    console.log(
      "Accept API Hit"
    );

    console.log(req.user);

    const complaint =
      await Complaint.findById(

        req.params.id

      );

    if (!complaint) {

      return res.status(404).json({

        success: false,

        message:
          "Complaint not found",

      });

    }

    // ======================
    // UPDATE
    // ======================

    complaint.status =
      "In Progress";

    complaint.assignedWorker =
      req.user.name;

    complaint.workerAccepted =
      true;

    complaint.completionDeadline =
      new Date(

        Date.now()

        +

        24 * 60 * 60 * 1000

      );

    // ======================
    // SAVE
    // ======================

    await complaint.save();

    res.status(200).json({

      success: true,

      message:
        "Complaint accepted",

      complaint,

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};

// ======================
// COMPLETE COMPLAINT
// ======================

exports.completeComplaint =
async (req, res) => {

  try {

    const complaint =
      await Complaint.findById(

        req.params.id

      );

    if (!complaint) {

      return res.status(404).json({

        success: false,

        message:
          "Complaint not found",

      });

    }

    // ======================
    // COMPLETE
    // ======================

    complaint.status =
      "Completed";

    complaint.completedAt =
      new Date();

    // ======================
    // SAVE
    // ======================

    await complaint.save();

    res.status(200).json({

      success: true,

      message:
        "Complaint completed",

      complaint,

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};