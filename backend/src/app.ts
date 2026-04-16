import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from '@/routes/auth.route';
import tweetRoutes from '@/routes/tweet.route';
import userRoutes from '@/routes/user.route';

import { globalErrorHandler } from '@/middleware/error.middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/profile_images', express.static(path.join(__dirname, '../uploads/profile_images')));
app.use('/profile_banners', express.static(path.join(__dirname, '../uploads/profile_banners')));

app.use('/api/auth', authRoutes);
app.use('/api/tweets', tweetRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Twitter Clone API' });
});

app.use(globalErrorHandler);

export default app;
