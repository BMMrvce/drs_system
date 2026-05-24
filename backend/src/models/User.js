import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'operator', 'viewer'],
      default: 'operator'
    },
    lastLoginAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model('User', userSchema);