const mongoose =
require("mongoose");

const complaintSchema =
new mongoose.Schema(

  {

    // ======================
    // STUDENT INFO
    // ======================

    studentName: {

      type: String,

      required: true,

    },

    studentEmail: {

      type: String,

      required: true,

    },

    studentId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },

    // ======================
    // HOSTEL INFO
    // ======================

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

    // ======================
    // CATEGORY
    // ======================

    category: {

      type: String,

      required: true,

    },

    otherCategory: {

      type: String,

      default: "",

    },

    // ======================
    // CONTACT
    // ======================

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

    // ======================
    // DESCRIPTION
    // ======================

    description: {

      type: String,

      required: true,

    },

    // ======================
    // STATUS
    // ======================

    status: {

      type: String,

      enum: [

        "Pending",

        "In Progress",

        "Completed",

      ],

      default: "Pending",

    },

    // ======================
    // WORKER INFO
    // ======================

    assignedWorker: {

      type: String,

      default: "",

    },

    workerPhone: {

      type: String,

      default: "",

    },

    workerAccepted: {

      type: Boolean,

      default: false,

    },

    // ======================
    // PRIORITY
    // ======================

    priority: {

      type: String,

      enum: [

        "Low",

        "Medium",

        "High",

      ],

      default: "Medium",

    },

    // ======================
    // COMPLETION
    // ======================

    completionDeadline: {

      type: Date,

    },

    completedAt: {

      type: Date,

    },

    // ======================
    // ESCALATION
    // ======================

    isEscalated: {

      type: Boolean,

      default: false,

    },

    escalationReason: {

      type: String,

      default: "",

    },

    // ======================
    // COMPLAINT ID
    // ======================

    complaintId: {

      type: String,

      unique: true,

      default: () =>

        `CMP-${Date.now()}`,

    },

  },

  {

    timestamps: true,

  }

);

module.exports =
mongoose.model(

  "Complaint",

  complaintSchema

);