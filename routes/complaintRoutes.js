const router =
  require("express").Router();

// =====================================
// IMPORTS
// =====================================

// CREATE

const createComplaintController =
  require(
    "../controllers/complaint/createComplaint"
  );

// STUDENT

const {

  getMyComplaints,

  getSingleComplaint,

} = require(

  "../controllers/complaint/studentComplaintController"

);

// WORKER

const {

  getWorkerComplaints,

  acceptComplaint,

  updateComplaintStatus

} = require(

  "../controllers/complaint/workerComplaintController"

);

// ADMIN

const {

  getAllComplaints,

  getEscalatedComplaints

} = require(

  "../controllers/complaint/adminComplaintController"

);

// STATS

const {

  getAdminStats,

  getHostelStats,

  getCategoryStats

} = require(

  "../controllers/complaint/statsController"

);

// =====================================
// MIDDLEWARE
// =====================================

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

const authorizeRole =
  require(
    "../middleware/roleMiddleware"
  );

// =====================================
// ROUTES
// =====================================

// =====================================
// CREATE COMPLAINT
// =====================================
router.post(

  "/",

  authMiddleware,

  authorizeRole("student"),

  createComplaintController.createComplaint

);

// =====================================
// STUDENT
// =====================================

router.get(

  "/my",

  authMiddleware,

  authorizeRole("student"),

  getMyComplaints

);

router.get(

  "/:id",

  authMiddleware,

  authorizeRole("student"),

  getSingleComplaint

);

// =====================================
// WORKER
// =====================================

router.get(

  "/worker",

  authMiddleware,

  authorizeRole("worker"),

  getWorkerComplaints

);

router.put(

  "/accept/:id",

  authMiddleware,

  authorizeRole("worker"),

  acceptComplaint

);

router.put(

  "/status/:id",

  authMiddleware,

  authorizeRole("worker"),

  updateComplaintStatus

);

// =====================================
// ADMIN
// =====================================

router.get(

  "/all",

  authMiddleware,

  authorizeRole("admin"),

  getAllComplaints

);

router.get(

  "/escalated",

  authMiddleware,

  authorizeRole("admin"),

  getEscalatedComplaints

);

// =====================================
// STATS
// =====================================

router.get(

  "/stats/admin",

  authMiddleware,

  authorizeRole("admin"),

  getAdminStats

);

router.get(

  "/stats/hostel",

  authMiddleware,

  authorizeRole("admin"),

  getHostelStats

);

router.get(

  "/stats/category",

  authMiddleware,

  authorizeRole("admin"),

  getCategoryStats

);

module.exports = router;