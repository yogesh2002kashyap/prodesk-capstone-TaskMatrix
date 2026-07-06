const { sendError } = require('../utils/apiError');

const errorHandler = (err, req, res, next) => {

    if (err.name === 'ZodError') {
        return sendError(
            res,
            400,
            'Validation failed',
            err.errors.map(e => ({
                field: e.path.join('.'),
                message: e.message,
            }))
        );
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return sendError(res, 400, `${field} already exists`);
    }

    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => ({
            field: e.path,
            message: e.message,
        }));

        return sendError(res, 400, 'Validation failed', errors);
    }

    if (err.name === 'JsonWebTokenError') {
        return sendError(res, 401, 'Invalid token');
    }

    if (err.name === 'TokenExpiredError') {
        return sendError(res, 401, 'Token has expired');
    }

    console.error(err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    return sendError(res, statusCode, message);
};

module.exports = errorHandler;