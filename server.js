const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

// DATABASE

const connectDB =
  require("./config/db");

// ROUTES

const authRoutes =
  require("./routes/authRoutes");

  const notificationRoutes =
  require(

    "./routes/notificationRoutes"

  );

const complaintRoutes =
  require("./routes/complaintRoutes");

// =====================================
// CONFIG
// =====================================

dotenv.config();

const app = express();

// =====================================
// DATABASE
// =====================================

connectDB();

// =====================================
// CORS
// =====================================

app.use(

  cors({

    origin: "*",

    methods: [

      "GET",

      "POST",

      "PUT",

      "DELETE",

      "PATCH",

    ],

    credentials: true,

  })

);

// =====================================
// MIDDLEWARE
// =====================================

app.use(express.json());

app.use(

  express.urlencoded({

    extended: true,

  })

);
// =====================================
// ROUTES
// =====================================

app.use(

  "/api/auth",

  authRoutes

);

app.use(

  "/api/complaints",

  complaintRoutes

);

// =====================================
// TEST
// =====================================

app.get("/", (req, res) => {

  res.send("API Running");

});

app.use(

  "/api/notifications",

  notificationRoutes

);

// =====================================
// SERVER
// =====================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(

    `Server running on port ${PORT}`

  );

});