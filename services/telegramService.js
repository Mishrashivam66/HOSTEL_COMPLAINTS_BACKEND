const axios = require("axios");

const BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN;

const STUDENT_CHAT_ID =
  process.env.STUDENT_CHAT_ID;

const WORKER_CHAT_ID =
  process.env.WORKER_CHAT_ID;

const ADMIN_CHAT_ID =
  process.env.ADMIN_CHAT_ID;


// =====================================
// COMMON SEND FUNCTION
// =====================================

const sendMessage = async (
  chatId,
  message
) => {

  const response = await axios.post(

    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,

    {

      chat_id: chatId,

      text: message,

    },

    {
      timeout: 5000
    }

  );

  return response.data;

};


// =====================================
// STUDENT NOTIFICATION
// =====================================

exports.sendStudentNotification =
async (message) => {

  return await sendMessage(
    STUDENT_CHAT_ID,
    message
  );

};


// =====================================
// WORKER NOTIFICATION
// =====================================

exports.sendWorkerNotification =
async (message) => {

  return await sendMessage(
    WORKER_CHAT_ID,
    message
  );

};


// =====================================
// ADMIN NOTIFICATION
// =====================================

exports.sendAdminNotification =
async (message) => {

  return await sendMessage(
    ADMIN_CHAT_ID,
    message
  );

};