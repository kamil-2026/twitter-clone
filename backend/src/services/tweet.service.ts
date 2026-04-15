import { z } from 'zod';
import prisma from '@/lib/db';

export const tweetSchema = z.object({
  content: z
    .string({ message: 'Content is required' })
    .min(1, 'Content cannot be empty')
    .max(280, 'Tweet cannot exceed 280 characters'),
});

export type TweetInput = z.infer<typeof tweetSchema>;

export const createTweet = async (userId: string, data: TweetInput) => {
  return prisma.tweet.create({
    data: {
      content: data.content,
      userId: userId,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  });
};

export const getTweets = async () => {
  const tweets = await prisma.tweet.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  return tweets.map((tweet) => ({
    id: tweet.id,
    content: tweet.content,
    createdAt: tweet.createdAt,
    user: tweet.user,
    likesCount: tweet._count.likes,
  }));
};

export const getTweetById = async (id: string) => {
  const tweet = await prisma.tweet.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  if (!tweet) {
    const err = new Error('Tweet not found');
    (err as any).status = 404;
    throw err;
  }

  return {
    id: tweet.id,
    content: tweet.content,
    createdAt: tweet.createdAt,
    user: tweet.user,
    likesCount: tweet._count.likes,
  };
};

export const deleteTweet = async (tweetId: string, userId: string) => {
  const tweet = await prisma.tweet.findUnique({
    where: {
      id: tweetId,
    },
  });

  if (!tweet) {
    const err = new Error('Tweet not found');
    (err as any).status = 404;
    throw err;
  }

  if (tweet.userId !== userId) {
    const err = new Error('Forbidden: You do not own this tweet');
    (err as any).status = 403;
    throw err;
  }

  return prisma.tweet.delete({
    where: {
      id: tweetId,
    },
  });
};
