import prisma from '@/lib/db';

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
