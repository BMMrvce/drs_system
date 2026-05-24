import { Router } from 'express';
import { Device } from '../models/Device.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const devices = await Device.find({}).sort({ updatedAt: -1 }).lean();
    res.json(devices);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const device = await Device.findOneAndUpdate(
      { id: req.body.id },
      { $set: req.body },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json(device);
  } catch (error) {
    next(error);
  }
});

router.post('/bulk', async (req, res, next) => {
  try {
    const devices = Array.isArray(req.body.devices) ? req.body.devices : [];

    await Device.deleteMany({});
    if (devices.length > 0) {
      await Device.insertMany(devices, { ordered: false });
    }

    const savedDevices = await Device.find({}).sort({ updatedAt: -1 }).lean();
    res.json({ devices: savedDevices });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Device.deleteOne({ id: req.params.id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;