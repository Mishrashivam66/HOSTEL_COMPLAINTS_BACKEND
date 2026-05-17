const Notification =
require(

  "../../models/Notification"

);

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

// ======================
// MARK AS READ
// ======================

exports.markAsRead =
async (req, res) => {

  try {

    const notification =

      await Notification.findById(

        req.params.id

      );

    if (!notification) {

      return res.status(404).json({

        success: false,

        message:
          "Notification not found",

      });

    }

    notification.isRead =
      true;

    await notification.save();

    res.status(200).json({

      success: true,

      message:
        "Notification marked as read",

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