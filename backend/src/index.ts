import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from '@/routes/auth.route';
import { globalErrorHandler } from '@/middleware/error.middleware';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'twitter clone' });
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
