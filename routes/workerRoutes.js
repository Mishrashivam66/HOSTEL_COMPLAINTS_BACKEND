const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const workerController = require("../controllers/worker/workerController");

// ======================
// OPEN COMPLAINTS
// ======================

router.get(
  "/complaints",

  authMiddleware,

  workerController.getOpenComplaints,
);
// ======================
// ACCEPT COMPLAINT
// ======================

router.put(
  "/complaints/:id/accept",

  authMiddleware,

  workerController.acceptComplaint,
);


// ======================
// COMPLETE COMPLAINT
// ======================

router.put(

  "/complaints/:id/complete",

  authMiddleware,

  workerController.completeComplaint

);

module.exports = router;
