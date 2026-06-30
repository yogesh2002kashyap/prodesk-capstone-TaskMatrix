const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper — generate a signed JWT for a user
const generateToken = (user) => {
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
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({ name, email });
    user.password = password;
    await user.save();

    const token = generateToken(user);
    setCookieToken(res, token);
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare submitted password against stored hash
    const isMatch = user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    setCookieToken(res,token);
    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

//POST /api/auth/logout 
const logout = (req, res) => {
  res.clearCookie('tm_token', {
    httpOnly:true,
    secure: process.env.NODE_ENV === 'production',
    sameSite:'strict',
  });
  res.status(200).json({message:'Logged out'})
};

module.exports = { register, login, logout };