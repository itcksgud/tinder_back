require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',    // ✅ 필수: Gmail SMTP 호스트
  port: 587,                 // 465 (SSL) 또는 587 (STARTTLS)
  secure: false,             // STARTTLS → false
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

/**
 * 이메일 인증 코드(OTP) 전송
 * @param {string} to - 수신 이메일 주소
 * @param {string} otp - 6자리 인증 코드
 */

async function sendOtpEmail(to, otp) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: '📧 Tinder 이메일 인증 코드',
    text: `인증 코드: ${otp}\n\nTinder 앱에서 이 코드를 입력해 주세요. 유효시간: 15분`,
  });
}

module.exports = { sendOtpEmail };
