import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import {
  getUserProfileHandler,
  searchUsersHandler,
  toggleFollowHandler,
} from '@/controllers/user.controller';

const router = Router();

router.get('/search', searchUsersHandler);
router.get('/:username', getUserProfileHandler);
router.post('/:id/follow', authenticate, toggleFollowHandler);

export default router;
