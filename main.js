const express = require('express');
const cors = require('cors');
const Blockchain = require('./blockchainApp/code/blockchain')
const api = require('./app/api');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', api);

app.use(function(req, res, next) {
	next({ status: 404, success: false, message: '404, Not Found!' });
});

app.use(handler);