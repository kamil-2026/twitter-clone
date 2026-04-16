import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import { upload } from '@/middleware/upload.middleware';
import {
  getMeHandler,
  getUserProfileHandler,
  searchUsersHandler,
  toggleFollowHandler,
  updateMeHandler,
} from '@/controllers/user.controller';

const router = Router();

router.get('/me', authenticate, getMeHandler);

router.patch(
  '/me',
  authenticate,
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
  ]),
  updateMeHandler,
);

router.get('/search', searchUsersHandler);
router.get('/:username', getUserProfileHandler);
router.post('/:id/follow', authenticate, toggleFollowHandler);

export default router;
