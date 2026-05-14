const express = require("express");

const router = express.Router();

const {
  sendStudentNotification
} = require("../services/telegramService");


// =====================================
// TEST TELEGRAM NOTIFICATION
// =====================================

router.get("/telegram-test", async (req, res) => {

  try {

    await sendStudentNotification(

      "✅ Telegram notification working successfully"

    );

    res.status(200).json({

      message: "Telegram message sent successfully"

    });

  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

});

router.get("/chat-id", async (req, res) => {

  const axios = require("axios");

  try {

    const response = await axios.get(

      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getUpdates`

    );

    res.json(response.data);

  } catch (error) {

    res.json(error.message);

  }

});
module.exports = router;