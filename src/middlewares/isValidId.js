const mongoose = require('mongoose');

const isValidId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.contactId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  next();
};

module.exports = isValidId;
