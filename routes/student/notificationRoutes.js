const router =
  require("express").Router();

const {

  getMyNotifications,

  markAsRead,

  getUnreadCount,

} = require(

  "../../controllers/student/notificationController"

);

const authMiddleware =
  require(

    "../../middleware/authMiddleware"

  );

// =====================================
// GET MY NOTIFICATIONS
// =====================================

router.get(

  "/my",

  authMiddleware,

  getMyNotifications

);

// =====================================
// MARK AS READ
// =====================================

router.put(

  "/read/:id",

  authMiddleware,

  markAsRead

);

// =====================================
// UNREAD COUNT
// =====================================

router.get(

  "/unread-count",

  authMiddleware,

  getUnreadCount

);

module.exports = router;