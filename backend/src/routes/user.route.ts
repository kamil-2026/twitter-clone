import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import { getUserProfileHandler, toggleFollowHandler } from '@/controllers/user.controller';

const router = Router();

router.get('/:username', getUserProfileHandler);
router.post('/:id/follow', authenticate, toggleFollowHandler);

export default router;
