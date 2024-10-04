const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const Session = require('../models/sessionModel');
const createError = require('http-errors');

const register = async ({ name, email, password }) => {

  const hashedPassword = await bcrypt.hash(password, 10);

  
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });


  return await newUser.save();
};


const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const createSession = async (userId) => {
  
  await Session.findOneAndDelete({ userId });

 
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

 
  const session = new Session({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + 15 * 60 * 1000, 
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

module.exports = {
  registerUser,
  loginUser,
  refreshSession,
  removeSession,
};
