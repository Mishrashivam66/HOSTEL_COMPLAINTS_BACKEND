const jwt =
require("jsonwebtoken");

const User =
require("../models/User");

// =====================================
// AUTH MIDDLEWARE
// =====================================

const authMiddleware =
async (req, res, next) => {

  try {

    // =====================================
    // AUTH HEADER
    // =====================================

    const authHeader =
      req.header(
        "Authorization"
      );

    if (!authHeader) {

      return res.status(401).json({

        success: false,

        message:
          "Access denied. No token provided.",

      });

    }

    // =====================================
    // TOKEN
    // =====================================

    const token =

      authHeader.startsWith(
        "Bearer "
      )

      ?

      authHeader.split(" ")[1]

      :

      authHeader;

    // =====================================
    // VERIFY TOKEN
    // =====================================

    const decoded =
      jwt.verify(

        token,

        process.env.JWT_SECRET

      );

    // =====================================
    // FIND USER
    // =====================================

    const user =
      await User.findById(

        decoded._id

      );

    if (!user) {

      return res.status(404).json({

        success: false,

        message:
          "User not found",

      });

    }

    // =====================================
    // SAVE USER
    // =====================================

    req.user = {

      _id:
        user._id,

      name:
        user.name,

      email:
        user.email,

      role:
        user.role,

      phoneNumber:
        user.phoneNumber,

      hostel:
        user.hostel,

      roomNumber:
        user.roomNumber,

    };

    // =====================================
    // NEXT
    // =====================================

    next();

  }

  catch (error) {

    console.log(error);

    res.status(401).json({

      success: false,

      message:
        "Invalid token",

    });

  }

};

module.exports =
authMiddleware;