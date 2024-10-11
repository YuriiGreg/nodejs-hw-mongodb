const createError = require('http-errors');
const User = require('../models/userModel');
const authService = require('../services/auth'); 

const registerUserController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    const newUser = await authService.registerUser({ name, email, password });

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

const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const session = await authService.loginUser(email, password);

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const refreshSessionController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createError(401, 'Refresh token not provided');
    }

    const newSession = await authService.refreshSession(refreshToken);

    res.cookie('refreshToken', newSession.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
      message: 'Session refreshed successfully!',
      data: {
        accessToken: newSession.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logoutUserController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createError(401, 'No refresh token provided');
    }

    await authService.removeSession(refreshToken);
    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUserController,
  loginUserController,
  refreshSessionController,
  logoutUserController,
};

