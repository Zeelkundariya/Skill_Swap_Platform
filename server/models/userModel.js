const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    skillsOffered: {
      type: [String],
      default: [],
    },
    skillsWanted: {
      type: [String],
      default: [],
    },
    availability: {
      type: String,
      default: '',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    reviews: [
      {
        reviewerName: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      }
    ],
    isBanned: {
      type: Boolean,
      default: false,
    },
    bio: { type: String, default: '' },
    timezone: { type: String, default: 'UTC' },
    experienceLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Beginner' },
    isEmailVerified: { type: Boolean, default: false },
    trustScore: { type: Number, default: 50 },
    learningStreak: { type: Number, default: 0 },
    responseRate: { type: Number, default: 100 },
    attendanceRate: { type: Number, default: 100 },
    completedSwaps: { type: Number, default: 0 },
    cancelledSwaps: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    // Gamification fields
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    badges: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.profilePicture = ret.profilePhoto;
        delete ret.profilePhoto;
        return ret;
      }
    }
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
