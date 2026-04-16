import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {z} from 'zod';
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
  name: z
      .string({ message: 'Name is required' })
      .min(1, 'Name is required')
      .max(50, 'Name cannot exceed 50 characters'),
  password: z
      .string({ message: 'Password is required' })
      .min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  identifier: z.string({ message: 'Email or username is required' }),
  password: z.string({ message: 'Password is required' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const register = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (existingUser) {
    const isEmailTaken = existingUser.email === data.email;
    const isUsernameTaken = existingUser.username === data.username;

    let message = '';
    if (isEmailTaken && isUsernameTaken) {
      message = 'Email and username already exist';
    } else if (isEmailTaken) {
      message = 'Email already exists';
    } else {
      message = 'Username already exists';
    }

    const err = new Error(message);
    (err as any).status = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = await prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      name: data.name,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
    },
  });

  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1d' });

  return {
    user: newUser,
    token,
  };
};

export const login = async (data: LoginInput) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.identifier },
        { username: data.identifier },
      ],
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
      name: user.name,
      email: user.email,
    },
    token,
  };
};
