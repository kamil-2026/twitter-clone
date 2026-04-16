import { z } from 'zod';
import type { NextFunction, Request, Response } from 'express';
import type { AuthRequest } from '@/middleware/auth.middleware';
import {
  getUserProfile,
  searchUsers,
  toggleFollow,
  updateUserProfile,
} from '@/services/user.service';

const updateMeSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  bio: z.string().max(160).optional().nullable(),
  location: z.string().max(30).optional().nullable(),
  website: z.string().url().max(100).optional().nullable().or(z.literal('')),
  avatar: z.string().url().optional().nullable(),
  banner: z.string().url().optional().nullable(),
});

export const getMeHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.userId as string;
    const profile = await getUserProfile(userId);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateMeHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.userId as string;
    const input = updateMeSchema.parse(req.body);
    const updatedUser = await updateUserProfile(userId, input);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const searchUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = z.string().min(1).parse(req.query.q);
    const users = await searchUsers(query);
    res.status(200).json(users);
  } catch (error) {
    res.status(200).json([]);
  }
};

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
