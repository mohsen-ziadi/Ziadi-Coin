const BaseErr = require('./baseErr');
// const logger = require('../logs/loggers');

function handler(err, req, res, next) {
	logErr(err);
	if(!err.isOperational) {
		return res.status(err.statusCode || 500).json({
			success: false,
			message: 'Internal Server Error.'
		});
		// process.exit(1);
	}
	returnErr(err, req, res, next);
}

function logErr(err) {
	console.error(err);
}

function returnErr(err, req, res, next) {
	return res.status(err.statusCode || 500).json({
		success: false,
		message: err.message
	});
}

function isOperationalError(err) {
	if(err instanceof BaseErr) return err.isOperational;
	return false;
}

module.exports = {
	handler
}