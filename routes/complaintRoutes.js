const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const authorizeRole = require("../middleware/roleMiddleware");

const complaintController = require("../controllers/complaintController");



// =====================================
// STUDENT ROUTES
// =====================================

// Create Complaint
router.post(
  "/create",
  authMiddleware,
  authorizeRole("student"),
  complaintController.createComplaint
);


// My Complaints
router.get(
  "/my-complaints",
  authMiddleware,
  authorizeRole("student"),
  complaintController.getMyComplaints
);



// =====================================
// ADMIN ROUTES
// =====================================

// All Complaints
router.get(
  "/all",
  authMiddleware,
  authorizeRole("admin"),
  complaintController.getAllComplaints
);


// Escalated Complaints
router.get(
  "/admin/escalated",
  authMiddleware,
  authorizeRole("admin"),
  complaintController.getEscalatedComplaints
);


// Admin Stats
router.get(
  "/admin/stats",
  authMiddleware,
  authorizeRole("admin"),
  complaintController.getAdminStats
);


// Hostel Stats
router.get(
  "/admin/hostel-stats",
  authMiddleware,
  authorizeRole("admin"),
  complaintController.getHostelStats
);


// Category Stats
router.get(
  "/admin/category-stats",
  authMiddleware,
  authorizeRole("admin"),
  complaintController.getCategoryStats
);



// =====================================
// WORKER ROUTES
// =====================================

// Worker Active Complaints
router.get(
  "/worker",
  authMiddleware,
  authorizeRole("worker"),
  complaintController.getWorkerComplaints
);


// Worker Accept Complaint
router.put(
  "/accept/:id",
  authMiddleware,
  authorizeRole("worker"),
  complaintController.acceptComplaint
);


// Worker Update Status
router.put(
  "/update-status/:id",
  authMiddleware,
  authorizeRole("worker"),
  complaintController.updateComplaintStatus
);



module.exports = router;