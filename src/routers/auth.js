const express = require('express');
const router = express.Router();
const {
  registerUserController,
  loginUserController,
  refreshSessionController,
  logoutUserController,
} = require('../controllers/auth');
const validateBody = require('../middlewares/validateBody');
const { registerSchema, loginSchema } = require('../schemas/authSchemas');


router.post('/register', validateBody(registerSchema), registerUserController);

router.post('/login', validateBody(loginSchema), loginUserController);

router.post('/refresh', refreshSessionController);

router.post('/logout', logoutUserController);

module.exports = router;

