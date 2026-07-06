const { sendError } = require('../utils/apiError');

const errorhandler = (err, req, res, next) => {

    if(err.name === 'ZodError') {
        return sendError(res, 400, 'Validation failed', err.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
        })));
    }

    if(err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return sendError(res, 400, `${field} already exist`);
    }

    if(err.name === 'ValidationError') {
        const error = Object.values(err.error).map(e => ({
            field: e.path,
            message: e.message,
        }));
        
        return sendError(res, 400, 'Validation Failed', errors);
    }

    if(err.name === 'JsonWebTokenError') {
        return sendError(res, 401, 'Invalid Token');
    }

    if(err.name === 'TokenExpiredError') {
        return sendError(res, 401, 'Token expired');
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    return sendError(res, statusCode, message);
};

module.exports = errorHandler;