// src/middlewares/authenticate.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log('🔐 [auth middle] Authorization header:', authHeader);
  if (!authHeader) return res.status(401).json({ success:false, message:'토큰 없음' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔐 [auth middle] decoded:', decoded);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log('🔐 [auth middle] verify 실패:', err.message);
    return res.status(401).json({ success:false, message:'유효하지 않은 토큰입니다.' });
  }
}


module.exports = authenticate;
