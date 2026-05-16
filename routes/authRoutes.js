const router =
  require("express").Router();

// =====================================
// CONTROLLERS
// =====================================

const {

  registerUser,

  loginUser,

  updateProfile,

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
router.get(

  "/me",

  authMiddleware,

  async (req, res) => {

    res.status(200).json({

      user: req.user,

    });

  }

);

// =====================================
// EXPORT
// =====================================

module.exports = router;