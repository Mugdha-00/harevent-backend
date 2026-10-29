const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const userPayload = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }
    // role is intentionally NOT taken from the request body (prevents self-promotion to admin)
    const user = await User.create({ name, email, password });
    res.status(201).json({ success: true, message: 'Registration successful', token: signToken(user._id), user: userPayload(user) });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    res.json({ success: true, message: 'Login successful', token: signToken(user._id), user: userPayload(user) });
  } catch (err) {
    next(err);
  }
};

exports.me = (req, res) => {
  res.json({ success: true, user: userPayload(req.user) });
};
