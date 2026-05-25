import { Router } from 'express';
import multer from 'multer';
import { cloudinary } from '../config/cloudinary.js';
import { VideoAsset } from '../models/VideoAsset.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/video', async (req, res, next) => {
  try {
    const matchId = (req.query.matchId || '').toString();
    const limit = Math.min(Number(req.query.limit || 20), 100);

    const query = {};
    if (matchId) {
      query.matchId = matchId;
    }

    const assets = await VideoAsset.find(query).sort({ createdAt: -1 }).limit(limit).lean();
    res.json({ assets });
  } catch (error) {
    next(error);
  }
});

router.post('/video', upload.single('video'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'video file is required' });
    }

    const matchId = req.body.matchId || '';
    const eventId = req.body.eventId || '';

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'drs-platform',
          public_id: `${matchId || 'match'}-${Date.now()}`,
          overwrite: true,
          invalidate: true
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(req.file.buffer);
    });

    const asset = await VideoAsset.create({
      matchId,
      eventId,
      originalName: req.file.originalname,
      cloudinaryPublicId: uploadResult.public_id,
      cloudinaryUrl: uploadResult.secure_url,
      bytes: uploadResult.bytes,
      duration: uploadResult.duration,
      format: uploadResult.format,
      resourceType: uploadResult.resource_type
    });

    res.status(201).json({
      asset,
      upload: uploadResult
    });
  } catch (error) {
    next(error);
  }
});

export default router;