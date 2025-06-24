const bcrypt = require('bcryptjs');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
} = require('../utils/jwt');
const { sendOtpEmail } = require('../utils/mailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user.model');

async function signup(req, res) {
  const { email, username, password } = req.body;
  if (await User.findOne({ email })) return res.status(409).json({ message: '이미 가입됨' });

  const hash = await bcrypt.hash(password, 10);
  const code = crypto.randomInt(100000, 999999).toString();
  const expiry = Date.now() + 15 * 60 * 1000; // 15분

  const user = await User.create({ email, username, password: hash, verify: { code, expiry }, isVerified: false });

  await sendOtpEmail(email, code);
  res.status(201).json({ message: '회원가입 완료. 인증 코드가 메일로 전송되었습니다.' });
}
async function login(req, res) {
  const { email, password } = req.body;
  console.log(req.body)
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: '가입되지 않은 이메일입니다.'
    });
  }

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return res.status(401).json({
      success: false,
      message: '비밀번호가 일치하지 않습니다.'
    });
  }

  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = await generateRefreshToken(user._id);

  console.log('완료')
  res.json({
    success: true,
    accessToken,
    refreshToken,
    user: { id: user._id, email: user.email, isVerified: user.isVerified, username: user.username },
  });
}

async function refreshToken(req, res) {
  console.log('🔄 [refreshToken] 요청 바디 token:', req.body.token);

  const { token } = req.body;
  try {
    const userId = await verifyRefreshToken(token);
    console.log('✅ 리프레시 토큰 검증 성공, userId:', userId);

    const accessToken = generateAccessToken({ id: userId });
    console.log('🔑 새 accessToken 생성:', accessToken.slice(0, 20) + '…');

    return res.json({ accessToken });
  } catch (err) {
    console.error('❗ [refreshToken] 오류:', err.message);
    return res.status(401).json({ msg: err.message });
  }
}

async function logout(req, res) {
  const { token } = req.body;
  try {
    await revokeRefreshToken(token);
    res.json({ msg: '로그아웃 완료' });
  } catch {
    res.status(500).json({ msg: '서버 오류' });
  }
}

async function me(req, res) {
  console.log('🔥 [me] 호출됨, req.userId =', req.userId);
  const user = await User.findById(req.userId).select('-password -verification');
  console.log('🔥 [me] DB 조회 결과 user =', user);
  if (!user) {
    console.log('🔥 [me] 사용자 없음, 404 반환');
    return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
  }
  console.log('🔥 [me] 성공 응답 전송');
  res.json({ success: true, user });
}

async function verifyCode(req, res) {
  const { code } = req.body;
  const user = await User.findOne({ 'verify.code': code });
  if (!user) return res.status(400).json({ message: '인증 코드가 잘못되었습니다.' });
  if (user.verify.expiry < Date.now()) return res.status(400).json({ message: '인증 코드가 만료되었습니다.' });

  user.isVerified = true;
  user.verify = undefined;
  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = await generateRefreshToken(user._id);
  await user.save();

  res.json({ accessToken, refreshToken, user: { id: user._id, email: user.email, username: user.username } });
}


async function resendVerification(req, res) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
  if (user.isVerified) return res.status(400).json({ message: '이미 인증된 사용자입니다.' });

  const code = crypto.randomInt(100000, 999999).toString();
  user.verify = { code, expiry: Date.now() + 15 * 60 * 1000 };
  await user.save();

  await sendOtpEmail(user.email, code);
  res.json({ message: '인증 코드가 재전송되었습니다.' });
}

module.exports = {
  signup,
  verifyCode,
  resendVerification,
  login,
  refreshToken,
  logout,
  me
};