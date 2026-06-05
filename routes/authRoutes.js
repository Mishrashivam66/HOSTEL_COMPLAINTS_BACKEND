const router =
  require("express").Router();

// =====================================
// CONTROLLERS
// =====================================

const {
  registerUser,
  loginUser,
  updateProfile,
  getMyProfile
} = require(
  "../controllers/authController"
);

// =====================================
// MIDDLEWARE
// =====================================

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

// =====================================
// REGISTER
// =====================================

router.post(
  "/register",
  registerUser
);

// =====================================
// LOGIN
// =====================================

router.post(
  "/login",
  loginUser
);

// =====================================
// UPDATE PROFILE
// =====================================

router.put(
  "/update-profile",
  authMiddleware,
  updateProfile
);

// =====================================
// GET PROFILE
// =====================================

router.get(
  "/me",
  authMiddleware,
  getMyProfile
);

// =====================================
// EXPORT
// =====================================

module.exports = router;
