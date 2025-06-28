const express = require("express");
const api = require("./api");
const Blockchain = require("./blockchainApp/code/blockchain");
const Pubsub = require("./utils/Pubsub");
const { handler } = require("./errors/handlers");
const tcpPortUsed = require('tcp-port-used')
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const blockchain = new Blockchain();
const pubsub = new Pubsub({ blockchain });

setTimeout(() => {
  pubsub.broadcastChain();
}, 1000);

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Request URL: ${req.originalUrl} - Method: ${req.method}`);
  next();
});

app.use("/api", api);



app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} Not Found`);
  error.status = 404;
  console.error(`Route ${req.originalUrl} Not Found`)
  next(error);
});

app.use((err, req, res, next) => {
  console.error(`Error Status: ${err.status || 500} - Message: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    status: err.status || 500,
    message: err.message || "Internal Server Error"
  });
});


app.use(handler);

let PORT = Number(process.env.PORT);

tcpPortUsed.check(PORT,'127.0.0.1')
.then(function(inUse){
  if(inUse){
    PORT+=Math.ceil(Math.random()*1000);
  }
  app.listen(PORT,()=> console.log(`Server is Running on PORT: ${PORT}`))
})

