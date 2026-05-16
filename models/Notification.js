const mongoose =
require("mongoose");

const notificationSchema =
new mongoose.Schema(

  {

    title: {

      type: String,

      required: true,

    },

    message: {

      type: String,

      required: true,

    },

    complaintId: {

      type: String,

      default: "",

    },

    isRead: {

      type: Boolean,

      default: false,

    },

  },

  {

    timestamps: true,

  }

);

module.exports =
mongoose.model(

  "Notification",

  notificationSchema

);