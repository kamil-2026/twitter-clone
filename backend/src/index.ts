import dotenv from 'dotenv';
import app from '@/app';

dotenv.config({ path: '../.env' });

const PORT = Number(process.env.BACKEND_PORT) || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
