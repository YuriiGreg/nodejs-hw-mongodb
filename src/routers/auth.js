const express = require('express');
const router = express.Router();
const { registerUser, loginUser, refreshSession, logoutUser } = require('../controllers/auth');
const validateBody = require('../middlewares/validateBody');
const { registerSchema } = require('../schemas/authSchemas');

router.post('/register', validateBody(registerSchema), registerUser);

router.post('/login', validateBody(loginSchema), loginUser);

router.post('/refresh', refreshSession);

router.post('/logout', logoutUser);

module.exports = router;
