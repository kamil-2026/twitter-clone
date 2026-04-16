import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import {
  getMeHandler,
  getUserProfileHandler,
  searchUsersHandler,
  toggleFollowHandler,
  updateMeHandler,
} from '@/controllers/user.controller';

const router = Router();

router.get('/me', authenticate, getMeHandler);
router.patch('/me', authenticate, updateMeHandler);
router.get('/search', searchUsersHandler);
router.get('/:username', getUserProfileHandler);
router.post('/:id/follow', authenticate, toggleFollowHandler);

export default router;
