import type { NextFunction, Response } from 'express';
import type { AuthRequest } from '@/middleware/auth.middleware';
import {
  createTweet,
  deleteTweet,
  getHomeFeed,
  getTweetById,
  getTweets,
  toggleLike,
  tweetSchema,
} from '@/services/tweet.service';

export const createTweetHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.userId as string;
    const input = tweetSchema.parse(req.body);
    const tweet = await createTweet(userId, input);
    res.status(201).json(tweet);
  } catch (error) {
    next(error);
  }
};

export const getTweetsHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tweets = await getTweets();
    res.status(200).json(tweets);
  } catch (error) {
    next(error);
  }
};

export const getTweetByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const tweet = await getTweetById(id as string);
    res.status(200).json(tweet);
  } catch (error) {
    next(error);
  }
};

export const deleteTweetHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.userId as string;
    const { id } = req.params;
    await deleteTweet(id as string, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getHomeFeedHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.userId as string;
    const tweets = await getHomeFeed(userId);
    res.status(200).json(tweets);
  } catch (error) {
    next(error);
  }
};

export const toggleLikeHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.userId as string;
    const tweetId = req.params.id as string;
    const isLiked = await toggleLike(userId, tweetId);
    res.status(200).json({
      message: isLiked ? 'Tweet liked' : 'Tweet unliked',
      liked: isLiked,
    });
  } catch (error) {
    next(error);
  }
};
