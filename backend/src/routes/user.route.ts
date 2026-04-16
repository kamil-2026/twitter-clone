import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import { toggleFollowHandler } from '@/controllers/user.controller';

const router = Router();

router.post('/:id/follow', authenticate, toggleFollowHandler);

export default router;
