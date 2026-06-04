const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

// DATABASE

const connectDB = require("./config/db");

// ROUTES

const authRoutes = require("./routes/authRoutes");

const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");

const complaintRoutes = require("./routes/complaintRoutes");
const adminController =
require(

  "./controllers/admin/adminController"

);

const workerRoutes = require("./routes/workerRoutes");

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
    origin: "https://hostel-complain-frontend-three.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.options("*", cors());

// =====================================
// MIDDLEWARE
// =====================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);
// =====================================
// ROUTES
// =====================================

app.use(
  "/api/auth",

  authRoutes,
);

app.use(
  "/api/complaints",

  complaintRoutes,
);

// =====================================
// TEST
// =====================================

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use(
  "/api/notifications",

  notificationRoutes,
);

app.use(
  "/api/admin",

  adminRoutes,
);
// worker 

app.use(

  "/api/worker",

  workerRoutes

);



// ======================
// AUTO OVERDUE CHECK
// ======================

// setInterval(

//   async () => {

//     await adminController
//       .checkOverdueComplaints();

//   },

//   60 * 1000

// );





// =====================================
// SERVER
// =====================================

module.exports = app;
