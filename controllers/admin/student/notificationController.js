const Notification =
  require("../../models/Notification");

// =====================================
// GET MY NOTIFICATIONS
// =====================================

exports.getMyNotifications =
  async (req, res) => {

    try {

      const notifications =
        await Notification.find({

          userId:
            req.user._id,

        })

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

// =====================================
// MARK AS READ
// =====================================

exports.markAsRead =
  async (req, res) => {

    try {

      await Notification.findByIdAndUpdate(

        req.params.id,

        {

          isRead: true,

        }

      );

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

// =====================================
// UNREAD COUNT
// =====================================

exports.getUnreadCount =
  async (req, res) => {

    try {

      const count =
        await Notification.countDocuments({

          userId:
            req.user._id,

          isRead: false,

        });

      res.status(200).json({

        success: true,

        count,

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