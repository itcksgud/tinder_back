const express = require('express');
const {
  signup,
  verifyCode,
  resendVerification,
  login,
  refreshToken,
  logout,
  me,
} = require('../controllers/auth.controller');
const authenticateMiddleware = require('../middlewares/authenticate');

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-code', verifyCode);
router.post('/resend-verification', authenticateMiddleware, resendVerification);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/me', authenticateMiddleware, me);

module.exports = router;
