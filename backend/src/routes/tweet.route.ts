import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import {
  createTweetHandler,
  deleteTweetHandler,
  getTweetByIdHandler,
  getTweetsHandler,
} from '@/controllers/tweet.controller';

const router = Router();

router.get('/', getTweetsHandler);
router.get('/:id', getTweetByIdHandler);
router.post('/', authenticate, createTweetHandler);
router.delete('/:id', authenticate, deleteTweetHandler);

export default router;
