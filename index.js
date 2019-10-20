const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// Auth Routes
const authRouter = require("./routes/auth");
const homeRouter = require("./routes/home");

app.use(express.json());

dotenv.config();

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connect to db!")
);

// Route Middlewares
app.use("/api/users", authRouter);
app.use("/api/home", homeRouter);

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
