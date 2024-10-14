const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/userModel');
const Session = require('../models/sessionModel');

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  return newUser;
};


const verifyPassword = async (password, hashedPassword) => {
  console.log('Password:', password);
  console.log('Hashed password:', hashedPassword);
  const result = await bcrypt.compare(password, hashedPassword);
  console.log('Password match:', result);
  return result;
};



const createSession = async (userId) => {

  console.log('JWT_ACCESS_SECRET:', process.env.JWT_ACCESS_SECRET);
  console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET);

  await Session.findOneAndDelete({ userId });

  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '60m' });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

  const session = new Session({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + 60 * 60 * 1000,
    refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });

  await session.save();
  return { accessToken, refreshToken };
};

const removeSession = async (refreshToken) => {
  const session = await Session.findOneAndDelete({ refreshToken });
  if (!session) {
    throw createError(404, 'Session not found');
  }
  return session;
};

const loginUser = async (email, password) => {
  console.log('Attempting to log in with email:', email);
  console.log('JWT_ACCESS_SECRET in login:', process.env.JWT_ACCESS_SECRET);
  console.log('JWT_REFRESH_SECRET in login:', process.env.JWT_REFRESH_SECRET);

  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, 'Invalid email or password');
  }

   const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    console.log('Invalid password');
    throw createError(401, 'Invalid email or password');
  }
  console.log('User authenticated successfully');
  const session = await createSession(user._id);
  return session;
};

const refreshSession = async (refreshToken) => {

   console.log('JWT_ACCESS_SECRET in refreshSession:', process.env.JWT_ACCESS_SECRET);
  console.log('JWT_REFRESH_SECRET in refreshSession:', process.env.JWT_REFRESH_SECRET);
  
  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createError(403, 'Invalid or expired refresh token');
  }

  await Session.findByIdAndDelete(session._id);
  return await createSession(session.userId);
};

module.exports = {
  registerUser,
  loginUser,
  refreshSession,
  removeSession,
  verifyPassword,
  createSession,
};

