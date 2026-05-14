const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
{
  // Student Reference
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Hostel Information
  hostel: {
    type: String,
    required: true
  },

  floor: {
    type: String,
    required: true
  },

  room: {
    type: String,
    required: true
  },

  // Student Contact Number
  phoneNumber: {
    type: String,
    required: true
  },

  // Complaint Department Category
  category: {
    type: String,
    enum: [
      "Electrical",
      "Plumbing",
      "Carpentry",
      "Painting",
      "Others"
    ],
    required: true
  },

  // Complaint Description
  description: {
    type: String,
    required: true
  },

  // Complaint Status Workflow
  status: {
    type: String,
    enum: [
      "Pending",
      "In Progress",
      "Completed"
    ],
    default: "Pending"
  },

  // Worker Accepted Complaint
  workerAccepted: {
    type: Boolean,
    default: false
  },

  // Worker Visit Time
  visitTime: {
    type: String
  },

  // Worker Acceptance Timestamp
  acceptedAt: {
    type: Date
  },

  // Complaint Deadline (24 Hours)
  completionDeadline: {
    type: Date
  },

  // Complaint Completion Timestamp
  completedAt: {
    type: Date
  },

  // Escalation Tracking
  isEscalated: {
    type: Boolean,
    default: false
  },

  // Telegram Chat ID (Optional)
  telegramChatId: {
    type: String
  }

},
{
  timestamps: true
}
);

module.exports = mongoose.model("Complaint", complaintSchema);