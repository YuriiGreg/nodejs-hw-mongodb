const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/userModel');
const Session = require('../models/sessionModel');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Перевірка наявності заголовка Authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError(401, 'Authorization header missing or incorrect');
    }

    // Витягуємо токен з заголовку
    const token = authHeader.split(' ')[1];

    // Розшифровуємо токен, перевіряючи його дійсність
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Знаходимо користувача за ID
    const user = await User.findById(decoded.id);
    if (!user) {
      throw createError(401, 'User not found');
    }

    // Перевіряємо, чи сесія з цим токеном активна
    const session = await Session.findOne({ accessToken: token });
    if (!session || session.accessTokenValidUntil < Date.now()) {
      throw createError(401, 'Access token expired');
    }

    // Додаємо користувача до запиту
    req.user = user;
    next(); // Переходимо до наступного middleware або роута
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(createError(401, 'Access token expired'));
    }
    next(createError(401, error.message || 'Unauthorized'));
  }
};

module.exports = authenticate;
