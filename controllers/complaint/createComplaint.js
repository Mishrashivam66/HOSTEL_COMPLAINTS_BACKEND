const Complaint =
require("../../models/Complaint");

const Notification =
require("../../models/Notification");

// =====================================
// CREATE COMPLAINT
// =====================================

exports.createComplaint =
async (req, res) => {

  try {

    // =====================================
    // BODY DATA
    // =====================================

    const {

      studentEmail,

      hostel,
      floor,
      room,

      phoneNumber,

      category,
      otherCategory,

      availabilityFrom,
      availabilityTo,

      description,

    } = req.body;

    // =====================================
    // VALIDATION
    // =====================================

    if (

      !hostel ||
      !floor ||
      !room ||
      !phoneNumber ||
      !category ||
      !description

    ) {

      return res.status(400).json({

        success: false,

        message:
          "All required fields must be filled",

      });

    }

    // =====================================
    // DESCRIPTION LIMIT
    // =====================================

    if (
      description.length > 1000
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Description exceeds 1000 characters",

      });

    }

    // =====================================
    // CHECK USER
    // =====================================

    if (!req.user) {

      return res.status(401).json({

        success: false,

        message:
          "Unauthorized user",

      });

    }

    // =====================================
    // DEADLINE
    // =====================================

    const deadline =
      new Date();

    deadline.setHours(

      deadline.getHours() + 24

    );

    // =====================================
    // CREATE COMPLAINT
    // =====================================

    const complaint =
      await Complaint.create({

        // ======================
        // STUDENT
        // ======================

        studentId:
          req.user._id,

        studentName:
          req.user.name,

        studentEmail:
          studentEmail ||
          req.user.email,

        // ======================
        // HOSTEL
        // ======================

        hostel,

        floor,

        room,

        // ======================
        // CONTACT
        // ======================

        phoneNumber,

        // ======================
        // CATEGORY
        // ======================

        category,

        otherCategory,

        // ======================
        // AVAILABILITY
        // ======================

        availabilityFrom,

        availabilityTo,

        // ======================
        // DESCRIPTION
        // ======================

        description,

        // ======================
        // STATUS
        // ======================

        status:
          "Pending",

        // ======================
        // DEADLINE
        // ======================

        completionDeadline:
          deadline,

      });

    // =====================================
    // CREATE STUDENT NOTIFICATION
    // =====================================

    await Notification.create({

      userId:
        req.user._id,

      title:
        "Complaint Submitted",

      message:
        "Your complaint has been submitted successfully",

      type:
        "submitted",

      isRead:
        false,

    });

    // =====================================
    // RESPONSE
    // =====================================

    res.status(201).json({

      success: true,

      message:
        "Complaint submitted successfully",

      complaint,

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        error.message ||
        "Server Error",

    });

  }

};