import User from "../models/User.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";


// ======================
// REGISTER
// ======================

export const registerUser = async (

  req,
  res

) => {

  try {

    const {

      name,
      email,
      password,
      role,

    } = req.body;

    // ======================
    // AMITY EMAIL CHECK
    // ======================

    if (

      !email.endsWith("@amity.edu")

      &&

      !email.endsWith("@s.amity.edu")

    ) {

      return res.status(400).json({

        message:
          "Use Amity Email Only",

      });

    }

    // ======================
    // EXISTING USER
    // ======================

    const userExists =
      await User.findOne({

        email,

      });

    if (userExists) {

      return res.status(400).json({

        message:
          "User already exists",

      });

    }

    // ======================
    // HASH PASSWORD
    // ======================

    const hashedPassword =
      await bcrypt.hash(

        password,
        10

      );

    // ======================
    // CREATE USER
    // ======================

    const user =
      await User.create({

        name,

        email,

        password:
          hashedPassword,

        role,

      });

    res.status(201).json({

      message:
        "Registration Successful",

      user,

    });

  }

  catch (error) {

    res.status(500).json({

      message:
        error.message,

    });

  }

};


// ======================
// LOGIN
// ======================

export const loginUser = async (

  req,
  res

) => {

  try {

    const {

      email,
      password,

    } = req.body;

    // ======================
    // FIND USER
    // ======================

    const user =
      await User.findOne({

        email,

      });

    if (!user) {

      return res.status(400).json({

        message:
          "User not found",

      });

    }

    // ======================
    // PASSWORD CHECK
    // ======================

    const isMatch =
      await bcrypt.compare(

        password,
        user.password

      );

    if (!isMatch) {

      return res.status(400).json({

        message:
          "Invalid Password",

      });

    }

    // ======================
    // JWT TOKEN
    // ======================

  if (

  user.role !== "admin"

  &&

  !user.isApproved

) {

  return res.status(403).json({

    message:
      "Admin approval pending",

  });

}

    const token = jwt.sign(
      

  {

    _id: user._id,

    role: user.role,

  },

  process.env.JWT_SECRET,

  {

    expiresIn: "7d",

  }

);

    res.status(200).json({

      message:
        "Login Successful",

      token,

      user,

    });

  }

  catch (error) {

    res.status(500).json({

      message:
        error.message,

    });

  }

};

export const updateProfile =
async (req, res) => {

  try {

    const updatedUser =
      await User.findByIdAndUpdate(

        req.user._id,

        {

          hostel:
            req.body.hostel,

          roomNumber:
            req.body.roomNumber,

          phoneNumber:
            req.body.phoneNumber,

        },

        {

          new: true,

        }

      ).select("-password");

    res.status(200).json({

      success: true,

      user: updatedUser,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};

// =====================================
// GET MY PROFILE
// =====================================

export const getMyProfile =
async (req, res) => {

  try {

    const user =
      await User.findById(

        req.user._id

      ).select("-password");

    if (!user) {

      return res.status(404).json({

        success: false,

        message:
          "User not found",

      });

    }

    res.status(200).json({

      success: true,

      user,

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};