const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/userModel');
const Session = require('../models/sessionModel');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

   
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError(401, 'Authorization header missing or incorrect');
    }

    const token = authHeader.split(' ')[1];

  
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

  
    const user = await User.findById(decoded.userId); 
    if (!user) {
      throw createError(401, 'User not found');
    }

    const session = await Session.findOne({ accessToken: token });
    if (!session || session.accessTokenValidUntil < Date.now()) {
      throw createError(401, 'Access token expired');
    }

    req.user = user;
    next(); 
  } catch (error) {
    
    if (error.name === 'TokenExpiredError') {
      return next(createError(401, 'Access token expired'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(createError(401, 'Invalid token'));
    }
    next(createError(401, error.message || 'Unauthorized'));
  }
};

module.exports = authenticate;

