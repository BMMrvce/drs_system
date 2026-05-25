import { Router } from 'express';
import { EventLog } from '../models/EventLog.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const matchId = (req.query.matchId || '').toString();
    const topic = (req.query.topic || '').toString();
    const limit = Math.min(Number(req.query.limit || 200), 1000);

    const query = {};
    if (matchId) query.matchId = matchId;
    if (topic) query.topic = topic;

    const logs = await EventLog.find(query).sort({ createdAt: -1 }).limit(limit).lean();
    res.json({ logs });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const payload = req.body || {};
    if (!payload.topic) {
      return res.status(400).json({ message: 'topic is required' });
    }

    const log = await EventLog.create({
      matchId: payload.matchId || '',
      eventId: payload.eventId || '',
      topic: payload.topic,
      eventType: payload.eventType || '',
      sensorId: payload.sensorId || '',
      receivedAt: payload.receivedAt ? new Date(payload.receivedAt) : new Date(),
      eventTimestamp: payload.eventTimestamp ? new Date(payload.eventTimestamp) : null,
      payload: payload.payload || {},
      bookmark: Boolean(payload.bookmark)
    });

    res.status(201).json({ log });
  } catch (error) {
    next(error);
  }
});

export default router;
