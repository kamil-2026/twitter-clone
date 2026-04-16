import prisma from '@/lib/db';

export const searchUsers = async (query: string, limit = 10) => {
  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: query,
        mode: 'insensitive',
      },
    },
    take: limit,
    select: {
      id: true,
      username: true,
      avatar: true,
      _count: {
        select: {
          followers: true,
        },
      },
    },
  });

  return users.map((u) => ({
    id: u.id,
    username: u.username,
    avatar: u.avatar,
    followers: u._count.followers,
  }));
};

export const getUserProfile = async (identifier: string) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ id: identifier }, { username: identifier }],
    },
    select: {
      id: true,
      username: true,
      avatar: true,
      createdAt: true,
      _count: {
        select: {
          followers: true,
          following: true,
          tweets: true,
        },
      },
      tweets: {
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          _count: {
            select: {
              likes: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    const err = new Error('User not found');
    (err as any).status = 404;
    throw err;
  }

  return {
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    joinedAt: user.createdAt,
    stats: {
      followers: user._count.followers,
      following: user._count.following,
      tweetCount: user._count.tweets,
    },
    tweets: user.tweets.map((t) => ({
      id: t.id,
      content: t.content,
      createdAt: t.createdAt,
      likesCount: t._count.likes,
    })),
  };
};

export const toggleFollow = async (followerId: string, followingId: string) => {
  if (followerId === followingId) {
    const err = new Error("You can't follow yourself");
    (err as any).status = 400;
    throw err;
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      id: followingId,
    },
  });

  if (!targetUser) {
    const err = new Error('User not found');
    (err as any).status = 404;
    throw err;
  }

  const followId = { followerId, followingId };

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: followId,
    },
  });

  if (existingFollow) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: followId,
      },
    });
    return false;
  }

  await prisma.follow.create({
    data: followId,
  });
  return true;
};
