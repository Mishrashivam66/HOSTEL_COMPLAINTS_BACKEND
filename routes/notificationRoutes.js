const router =
  require("express").Router();

const {

  getNotifications,

  markAsRead,

} = require(

  "../controllers/notificationController"

);

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

// =====================================
// GET NOTIFICATIONS
// =====================================

router.get(

  "/",

  authMiddleware,

  getNotifications

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
// EXPORT
// =====================================

module.exports = router;