import express from "express";

import cors from "cors";

import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();


// ======================
// DATABASE
// ======================

connectDB();


// ======================
// CORS CONFIG
// ======================

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


// ======================
// MIDDLEWARE
// ======================

app.use(express.json());

app.use(express.urlencoded({

  extended: true,

}));


// ======================
// ROUTES
// ======================

app.use("/api/auth", authRoutes);


// ======================
// TEST ROUTE
// ======================

app.get("/", (req, res) => {

  res.send("API Running");

});


// ======================
// SERVER
// ======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(

    `Server running on port ${PORT}`

  );

});