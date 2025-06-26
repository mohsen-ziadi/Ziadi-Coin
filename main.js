const express = require("express");
const cors = require("cors");
const Blockchain = require("./blockchainApp/code/blockchain");
const api = require("./api");
const { handler } = require("./errors/handlers");
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", api);

app.use(function (req, res, next) {
  next({ status: 404, success: false, message: "404, Not Found!" });
});

app.use(handler);

// run app
app.listen(process.env.PORT, () => {
  console.log(`Server is Running on port ${process.env.PORT}`);
  // console.log(`Server is Running on port: 3000`);
});
