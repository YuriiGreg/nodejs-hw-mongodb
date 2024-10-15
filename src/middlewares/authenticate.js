const jwt = require('jsonwebtoken');
const createHttpError = require('http-errors');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'No access token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    next(createHttpError(401, 'Access token expired'));
  }
};

module.exports = authenticate;


