const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/apiError');

const authGuard = (req, res, next) => {
  const token = req.cookies?.tm_token;

  if (!token) {
    return sendError(res, 401, 'No authentication token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return sendError(res, 401, 'Token is invalid or has expired');
  }
};

module.exports = authGuard;