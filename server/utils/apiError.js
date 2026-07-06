class ApiError extends Error {
    constructor(statusCode, message, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}

const sendError = (res, statusCode, message, errors = []) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
};

const sendSuccess = (res,statusCode, data, message = 'Success') => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

module.exports = { ApiError, sendError, sendSuccess };