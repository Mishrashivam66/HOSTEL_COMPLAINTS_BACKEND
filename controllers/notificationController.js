const Notification = require(
  "../models/Notification"
);

// =====================================
// GET NOTIFICATIONS
// =====================================

exports.getNotifications =
  async (req, res) => {

    try {

      const notifications =
        await Notification.find({

          userId:
            req.user._id,

        }).sort({

          createdAt: -1,

        });

      res.status(200).json({

        success: true,

        notifications,

      });

    } catch (error) {

      res.status(500).json({

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

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  };