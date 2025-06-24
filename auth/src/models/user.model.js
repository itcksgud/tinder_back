const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const userSchema = new mongoose.Schema({
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:   { type: String, required: true },  // 해시 저장
  username:   { type: String, required: true, trim: true },
  isVerified: { type: Boolean, default: false },
  verify: {
    code: String,
    expiry: Date,
  },
  // 프로필 관련
  firstName: { type: String },
  lastName:  { type: String },
  birthDate: { type: Date },
  gender:    { type: String, enum: ['male','female','other'] },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0,0] }, // [lng, lat]
  },
  photos:       [String],   // 이미지 URL 리스트
  bio:          { type: String },
  interests:    [String],
  // 선호 프로필 정보
  seeking: {
    gender:      { type: String, enum: ['male','female','other'] },
    minAge:      Number,
    maxAge:      Number,
    maxDistance: Number, // km 단위
  },

  likes:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  matches:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  blocked:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true,
});

// 인덱스: 위치 필드를 geospatial 쿼리에 사용하도록 설정
userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
