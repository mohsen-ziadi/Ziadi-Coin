const express = require('express');
const cors = require('cors');
const Blockchain = require('./blockchaiApp/code/blockchain')
const api = require('./app/api');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));