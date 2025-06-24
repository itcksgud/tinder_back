// utils/jwt.js
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const RefreshTokenModel = require('../models/refreshToken.model'); // DB 모델

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
}

async function generateRefreshToken(userId) {
  const token = uuidv4();  
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7d
  await RefreshTokenModel.create({ token, user: userId, expiresAt: expires });
  return token;
}

async function verifyRefreshToken(token) {
  const record = await RefreshTokenModel.findOne({ token });
  if (!record) throw new Error('Invalid refresh token');
  if (record.expiresAt < new Date()) {
    await RefreshTokenModel.deleteOne({ _id: record._id });
    throw new Error('Refresh token expired');
  }
  return record.user;
}

function revokeRefreshToken(token) {
  return RefreshTokenModel.deleteOne({ token });
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  verifyAccessToken,
};
