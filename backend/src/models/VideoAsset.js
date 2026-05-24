import mongoose from 'mongoose';

const videoAssetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    matchId: {
      type: String,
      index: true
    },
    eventId: {
      type: String,
      index: true
    },
    originalName: String,
    cloudinaryPublicId: {
      type: String,
      required: true
    },
    cloudinaryUrl: {
      type: String,
      required: true
    },
    bytes: Number,
    duration: Number,
    format: String,
    resourceType: {
      type: String,
      default: 'video'
    }
  },
  {
    timestamps: true
  }
);

export const VideoAsset = mongoose.model('VideoAsset', videoAssetSchema);