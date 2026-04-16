import type { NextFunction, Response } from 'express';
import type { AuthRequest } from '@/middleware/auth.middleware';
import { getUserProfile, toggleFollow } from '@/services/user.service';

export const getUserProfileHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username } = req.params;
    const profile = await getUserProfile(username as string);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

export const toggleFollowHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const followerId = req.userId as string;
    const { id: followingId } = req.params as { id: string };
    const isFollowing = await toggleFollow(followerId, followingId);
    res.status(200).json({
      message: isFollowing ? 'Followed successfully' : 'Unfollowed successfully',
      following: isFollowing,
    });
  } catch (error) {
    next(error);
  }
};
