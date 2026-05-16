const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,

      required: true,
    },

    studentEmail: {
      type: String,

      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    hostel: {
      type: String,

      required: true,
    },

    floor: {
      type: String,

      required: true,
    },

    room: {
      type: String,

      required: true,
    },

    category: {
      type: String,

      required: true,
    },

    otherCategory: {
      type: String,
    },

    phoneNumber: {
      type: String,

      required: true,
    },
    availabilityFrom: {
      type: String,

      required: true,
    },

    availabilityTo: {
      type: String,

      required: true,
    },

    description: {
      type: String,

      required: true,
    },

    status: {
      type: String,

      default: "Pending",
    },

    completionDeadline: {
      type: Date,
    },

    isEscalated: {
      type: Boolean,

      default: false,
    },

    complaintId: {
      type: String,

      unique: true,

      default: () => `CMP-${Date.now()}`,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "Complaint",

  complaintSchema,
);
