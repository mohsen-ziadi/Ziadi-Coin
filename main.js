const express = require("express");
const api = require("./api");
const Blockchain = require("./blockchainApp/code/blockchain");
const Pubsub = require("./utils/Pubsub");
const { handler } = require("./errors/handlers");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const blockchain = new Blockchain();
const pubsub = new Pubsub({ blockchain });

setTimeout(() => {
  pubsub.broadcastChain();
}, 1000);

app.use("/api", api);

app.use(function (req, res, next) {
  next({ status: 404, success: false, message: "404, Not Found!" });
});

app.use(handler);

let port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});
