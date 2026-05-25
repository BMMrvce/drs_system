import mongoose from 'mongoose';

const eventLogSchema = new mongoose.Schema(
  {
    matchId: {
      type: String,
      index: true,
      default: ''
    },
    eventId: {
      type: String,
      index: true,
      default: ''
    },
    topic: {
      type: String,
      required: true,
      trim: true
    },
    eventType: {
      type: String,
      trim: true,
      default: ''
    },
    sensorId: {
      type: String,
      trim: true,
      default: ''
    },
    receivedAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    eventTimestamp: {
      type: Date,
      default: null
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    bookmark: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

eventLogSchema.index({ matchId: 1, createdAt: -1 });

export const EventLog = mongoose.model('EventLog', eventLogSchema);
