const { sendError } = require('../utils/apiError');

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if(!result.success) {
        const errors = result.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
        }));
        return sendError(res, 400, 'Validation Failed', errors);
    }

    req.body = result.data;
    next();
};

const validateParams = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.params);

    if(!result.success) {
        const errors = result.error.errors.map(e => ({
            field: e.path.join('.'),
            message:e.message,
        }));
        return sendError(res, 400, 'Invalid request parameters', errors);
    }

    req.params = result.data;
    next();
}

module.exports = {validate, validateParams};