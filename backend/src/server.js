import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDatabase } from './config/db.js';
import { configureCloudinary } from './config/cloudinary.js';
import authRoutes from './routes/auth.js';
import deviceRoutes from './routes/devices.js';
import uploadRoutes from './routes/uploads.js';
import logRoutes from './routes/logs.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json({ limit: '25mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'drs-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/logs', logRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: error?.message || 'Internal server error' });
});

async function start() {
  await connectDatabase();
  configureCloudinary();

  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start backend', error);
  process.exit(1);
});