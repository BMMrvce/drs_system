import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    id: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    ipAddress: {
      type: String,
      required: true,
      trim: true
    },
    mqttTopic: {
      type: String,
      required: true,
      trim: true
    },
    online: {
      type: Boolean,
      default: false
    },
    firmwareVersion: {
      type: String,
      default: ''
    },
    batteryLevel: Number,
    signalStrength: Number,
    lastHeartbeat: Date,
    capabilities: [String]
  },
  {
    timestamps: true
  }
);

deviceSchema.index({ id: 1, userId: 1 }, { unique: true });

export const Device = mongoose.model('Device', deviceSchema);