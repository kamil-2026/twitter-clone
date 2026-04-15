import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is missing in environment variables');
}

export const registerSchema = z.object({
  email: z.string({ message: 'Email is required' }).email('Invalid email format'),
  username: z
    .string({ message: 'Username is required' })
    .min(4, 'Username must be at least 4 characters')
    .max(15, 'Username cannot exceed 15 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z
    .string({ message: 'Password is required' })
    .min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string({ message: 'Email is required' }).email('Invalid email format'),
  password: z.string({ message: 'Password is required' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const register = async (data: RegisterInput) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  try {
    return await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      const err = new Error('Email or username already exists');
      (err as any).status = 400;
      throw err;
    }
    throw error;
  }
};

export const login = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    const err = new Error('Invalid credentials');
    (err as any).status = 401;
    throw err;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    token,
  };
};
