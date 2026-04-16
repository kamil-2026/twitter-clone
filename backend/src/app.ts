import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from '@/routes/auth.route';
import tweetRoutes from '@/routes/tweet.route';
import userRoutes from '@/routes/user.route';

import { globalErrorHandler } from '@/middleware/error.middleware';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tweets', tweetRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Twitter Clone API' });
});

app.use(globalErrorHandler);

export default app;
