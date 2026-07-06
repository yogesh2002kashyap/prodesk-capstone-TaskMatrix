const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendSuccess, sendError } = require('../utils/apiError');


const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is missing');
  }
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const setCookieToken = (res, token) => {
  res.cookie('tm_token', token, {
    httpOnly: true,       
    secure: process.env.NODE_ENV === 'production', 
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',  
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim() || !email || !email.trim() || !password) {
      return sendError(res, 400, 'Name, email, and password are required', errors);
    }

    if (password.length < 8) {
      return sendError(res, 400, 'Password must be at least 8 characters long', errors);
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return sendError(res, 400, 'Email already registered', errors);
    }

    const user = new User({ name, email });
    user.password = password;
    await user.save();

    const token = generateToken(user);
    setCookieToken(res, token);
    return sendSuccess(res, 200, {user: { id: user._id, name: user.name, email: user.email, role: user.role }}, 'Registered successfully');
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim() || !password) {
      return sendError(res, 400, 'Email and password are required', errors);
    }

    
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 401,'Invalid email or password', errors);
    }

    
    const isMatch = user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401,'Invalid email or password', errors);
    }

    const token = generateToken(user);
    setCookieToken(res, token);
    return sendSuccess(res, 200, {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    }, 'Login successfully' );
  } catch (err) {
    next(err);
  }
};

//POST /api/auth/logout 
const logout = (req, res) => {
  res.clearCookie('tm_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  });
  sendSuccess(res, 200, 'Logged out');
};

module.exports = { register, login, logout };