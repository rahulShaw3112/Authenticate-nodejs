const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')

const userRoutes = require("./routes/user");
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Acess-Control-Allow-Origin", "*");
  res.setHeader("Acess-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Acess-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/user", userRoutes);

mongoose
  .connect(
    process.env.CONNECTION_STRING
  )
  .then((res) => {
    console.log("connected to db");
    app.listen(3000, () => {
      console.log("server hosting at https://localhost:3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
