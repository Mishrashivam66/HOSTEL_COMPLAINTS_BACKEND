const Complaint = require(
  "../../models/Complaint"
);

const Notification =
  require(

    "../../models/Notification"

  );

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

        studentName,
        studentEmail,

        hostel,
        floor,
        room,

        phoneNumber,

        category,
        otherCategory,

        availabilityFrom,
        availabilityTo,

        description

      } = req.body;

      // =====================================
      // VALIDATION
      // =====================================

      if (

        !hostel ||
        !floor ||
        !room ||
        !phoneNumber ||
        !category

      ) {

        return res.status(400).json({

          success: false,

          message:
            "All required fields must be filled"

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
            "Description exceeds 1000 characters"

        });

      }

      // =====================================
      // 24H DEADLINE
      // =====================================

      const deadline = new Date();

      deadline.setHours(

        deadline.getHours() + 24

      );

      // =====================================
      // CREATE COMPLAINT
      // =====================================

      const complaint =
        await Complaint.create({

          studentId:
            req.user._id,

          studentName,
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

          status: "Pending",

          completionDeadline:
            deadline

        });

      // =====================================
      // CREATE NOTIFICATION
      // =====================================

      await Notification.create({

        userId:
          req.user._id,

        title:
          "Complaint Submitted",

        message:
          `Your ${category} complaint has been submitted successfully.`,

      });

      // =====================================
      // RESPONSE
      // =====================================

      res.status(201).json({

        success: true,

        message:
          "Complaint submitted successfully",

        complaint

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message ||

          "Server Error"

      });

    }

  };