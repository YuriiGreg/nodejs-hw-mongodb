const createError = require('http-errors');
const User = require('../models/userModel');
const authService = require('../services/auth');
const Session = require('../models/sessionModel');
const { removeSession } = require('../services/auth');

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(409, 'Email in use');
    }

   
    const newUser = await authService.register({ name, email, password });

 
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

   
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(401, 'Invalid email or password');
    }

 
    const isPasswordValid = await authService.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw createError(401, 'Invalid email or password');
    }

   
    const session = await authService.createSession(user._id);

   
    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

   
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};


const refreshSession = async (req, res, next) => {
  try {
    
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createError(401, 'Refresh token not provided');
    }

   
    const session = await Session.findOne({ refreshToken });
    if (!session) {
      throw createError(403, 'Invalid or expired refresh token');
    }

  
    await Session.findByIdAndDelete(session._id);


    const newSession = await authService.createSession(session.userId);

    
    res.cookie('refreshToken', newSession.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

    
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: newSession.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};


const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      throw createError(401, 'No refresh token provided');
    }

    await removeSession(refreshToken);

    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
};
