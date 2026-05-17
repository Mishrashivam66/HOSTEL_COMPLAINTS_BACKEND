const mongoose = require("mongoose");

// =====================================
// USER SCHEMA
// =====================================

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: true,
    },

    email: {
      type: String,

      required: true,

      unique: true,
    },

    password: {
      type: String,

      required: true,
    },

    role: {
      type: String,

      enum: ["student", "worker", "admin"],

      default: "student",
    },

    // =====================================
    // ADMIN APPROVAL
    // =====================================

    isApproved: {
      type: Boolean,

      default: false,
    },

    // =====================================
    // PROFILE FIELDS
    // =====================================


    hostel: {
      type: String,

      default: "",
    },

    roomNumber: {
      type: String,

      default: "",
    },

    phoneNumber: {
      type: String,

      default: "",
    },
  },

  {
    timestamps: true,
  },
);

// =====================================
// EXPORT MODEL
// =====================================

module.exports = mongoose.model(
  "User",

  userSchema,
);
