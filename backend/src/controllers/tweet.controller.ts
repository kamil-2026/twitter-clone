import type { NextFunction, Response } from 'express';
import type { AuthRequest } from '@/middleware/auth.middleware';
import { createTweet, deleteTweet, getHomeFeed, getTweetById, getTweets, tweetSchema, } from '@/services/tweet.service';

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
