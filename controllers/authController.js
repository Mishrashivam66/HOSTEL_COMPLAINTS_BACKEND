import User from "../models/User.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import sendVerificationEmail from "../utils/sendVerificationEmail.js";


// =====================================
// REGISTER USER
// =====================================

export const registerUser = async (req, res) => {

  try {

    const {
      name,
      password,
      role,
      email: rawEmail,
    } = req.body;

    const email = rawEmail
      ? rawEmail.toLowerCase()
      : "";

    // REQUIRED FIELDS

    if (!name || !email || !password) {

      return res.status(400).json({

        message:
          "Name, email and password are required",

      });

    }

    // EMAIL VALIDATION

    if (
      !email.endsWith("@amity.edu") &&
      !email.endsWith("@s.amity.edu")
    ) {

      return res.status(400).json({

        message:
          "Use Amity email only",

      });

    }

    // CHECK USER

    const userExists = await User.findOne({ email });

    if (userExists) {

      return res.status(400).json({

        message:
          "User already exists",

      });

    }

    // HASH PASSWORD

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ROLE

    const allowedRoles = [
      "student",
      "worker",
    ];

    const userRole =
      allowedRoles.includes(role)
        ? role
        : "student";

    // VERIFY TOKEN

    const verificationToken = jwt.sign(

      { email },

      process.env.JWT_SECRET,

      { expiresIn: "1d" }

    );

    // CREATE USER

    await User.create({

      name,

      email,

      password: hashedPassword,

      role: userRole,

      isVerified: false,

      verificationToken,

    });

    // SEND EMAIL
await sendVerificationEmail(

  email,

  verificationToken,

  name

);

    // RESPONSE

    res.status(201).json({

      message:
        "Verification email sent",

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};


// =====================================
// VERIFY EMAIL
// =====================================

export const verifyEmail = async (
  req,
  res
) => {

  try {

    const token = req.params.token;

    const decoded = jwt.verify(

      token,

      process.env.JWT_SECRET

    );

    const user = await User.findOne({

      email: decoded.email,

      verificationToken: token,

    });

    if (!user) {

      return res.status(400).json({

        message:
          "Invalid or expired token",

      });

    }

    user.isVerified = true;

    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({

      message:
        "Email verified successfully",

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};


// =====================================
// LOGIN USER
// =====================================

export const loginUser = async (
  req,
  res
) => {

  try {

    const password = req.body.password;

    const email = req.body.email
      ? req.body.email.toLowerCase()
      : "";

    // REQUIRED

    if (!email || !password) {

      return res.status(400).json({

        message:
          "Email and password are required",

      });

    }

    // FIND USER

    const user = await User.findOne({
      email,
    });

    if (!user) {

      return res.status(400).json({

        message:
          "User not found",

      });

    }

    // EMAIL VERIFY CHECK

    if (!user.isVerified) {

      return res.status(400).json({

        message:
          "Please verify your email first",

      });

    }

    // PASSWORD CHECK

    const isMatch = await bcrypt.compare(

      password,

      user.password

    );

    if (!isMatch) {

      return res.status(400).json({

        message:
          "Invalid password",

      });

    }

    // JWT TOKEN

    const token = jwt.sign(

      {

        id: user._id,

        role: user.role,

      },

      process.env.JWT_SECRET,

      {

        expiresIn: "7d",

      }

    );

    // RESPONSE

    res.status(200).json({

      message:
        "Login successful",

      token,

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

      },

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};