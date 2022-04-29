const express = require("express");
const cors = require("cors");
const app = express();

const authRoute = require("./Routes/authRoutes");
const db = require("./db");

app.use(cors());

app.use(express.json());
app.get("/api", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "API works",
  });
});

app.use("/api/user", authRoute);

module.exports = app;
