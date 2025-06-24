# Tinder Clone Backend

> 🚀 Node.js + Express 기반 데이팅 앱 백엔드

---

## 📖 프로젝트 개요
Tinder 스타일의 매칭·채팅·위치 기반 서비스를 제공하는 백엔드 서버입니다.

- **주요 기능**  
  - 사용자 인증 (회원가입·로그인·이메일 인증·토큰 갱신·로그아웃)  
  - 프로필 관리  
  - 매칭 매커니즘  - 미구현
  - 실시간 채팅 (Socket.io) - 미구현  
  - 위치 기반 사용자 탐색  - 미구현

---

## 🛠️ 기술 스택
- **런타임**: Node.js  
- **웹 프레임워크**: Express  
- **DB**: MongoDB (Mongoose)  
- **인증**: JWT (JSON Web Token)  
- **환경 변수 관리**: dotenv  

---

## 🚀 설치 및 실행

1. 소스 코드 클론  
```bash
   git clone https://github.com/itcksgud/tinder_back.git
   cd tinder_back
```
2. 환경 변수 설정
   프로젝트 루트에 `.env` 파일을 생성하고 아래 예시처럼 값을 채워주세요.

 ```env
 PORT=7078
 MONGODB_URI=mongodb://<user>:<pass>@<host>:27017/tinder?authSource=admin
 JWT_SECRET=your_jwt_secret
 EMAIL_SERVICE_API_KEY=your_email_service_key   # (이메일 인증용)
 ```

3. 의존성 설치

 ```bash
 npm install
 ```

4. 개발 서버 실행

 ```bash
 npm run dev
 ```

5. 프로덕션 빌드 & 실행

 ```bash
 npm run build
 npm start
 ```

---

## ⚙️ 앱 초기화 (Express 설정 예시)

```js
// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./auth/auth.routes');
const app = express();

// 미들웨어
app.use(express.json());

// 몽고DB 연결
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 라우트 등록
app.use('/api/auth', authRouter);

// 그 외 라우터 (users, matches, chats 등)
// app.use('/api/users', usersRouter);
// ...

// 서버 시작
const PORT = process.env.PORT || 7078;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

## 📑 API 명세

### 1. 인증(Auth)

| Method | Endpoint                        | 설명                      | Auth |
| ------ | ------------------------------- | ----------------------- | :--: |
| POST   | `/api/auth/signup`              | 회원가입                    |  🚫  |
| POST   | `/api/auth/verify-code`         | 이메일 인증 코드 확인            |  🚫  |
| POST   | `/api/auth/resend-verification` | 인증 코드 재전송 (로그인 필요)      |   ✅  |
| POST   | `/api/auth/login`               | 로그인 (액세스 토큰·리프레시 토큰 발급) |  🚫  |
| POST   | `/api/auth/refresh-token`       | 리프레시 토큰으로 액세스 토큰 재발급    |  🚫  |
| POST   | `/api/auth/logout`              | 로그아웃 (리프레시 토큰 무효화)      |  🚫  |
| GET    | `/api/auth/me`                  | 내 정보 조회                 |   ✅  |

> **Auth**: 🚫 = 공개, ✅ = 액세스 토큰(required)

---



