const express =
require("express");

const router =
express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const adminController =
require("../controllers/admin/adminController");
const {

  getNotifications,

  markAsRead,

} = require(

  "../controllers/admin/notificationController"

);

// ======================
// ALL COMPLAINTS
// ======================

router.get(

  "/complaints",

  authMiddleware,

  adminController.getAllComplaints

);

// ======================
// PENDING USERS
// ======================

router.get(

  "/pending-users",

  authMiddleware,

  adminController.getPendingUsers

);

// ======================
// APPROVE USER
// ======================

router.put(

  "/approve-user/:id",

  authMiddleware,

  adminController.approveUser

);

// ======================
// HOSTEL STUDENT STATS
// ======================

router.get(

  "/hostel-students",

  authMiddleware,

  adminController.getHostelStudentStats

);

// ======================
// HOSTEL COMPLAINT STATS
// ======================

router.get(

  "/hostel-complaints",

  authMiddleware,

  adminController.getHostelComplaintStats

);

// ======================
// DASHBOARD STATS
// ======================

router.get(

  "/dashboard-stats",

  authMiddleware,

  adminController.getDashboardStats

);

// ======================
// OVERDUE COMPLAINTS
// ======================

router.get(

  "/overdue-complaints",

  authMiddleware,

  adminController.getOverdueComplaints

);

// ======================
// GET NOTIFICATIONS
// ======================

// ======================
// NOTIFICATIONS
// ======================

router.get(

  "/notifications",

  authMiddleware,

  getNotifications

);

router.put(

  "/notifications/:id",

  authMiddleware,

  markAsRead

);

// ======================
// ALL STUDENTS
// ======================

router.get(

  "/students",

  authMiddleware,

  adminController.getAllStudents

);


// ======================
// ALL WORKERS
// ======================

router.get(

  "/workers",

  authMiddleware,

  adminController.getAllWorkers

);

// ======================
// ALL COMPLAINTS
// ======================

router.get(

  "/complaints",

  authMiddleware,

  adminController.getAllComplaints

);

module.exports =
router;