import type { NextFunction, Request, Response } from 'express';
import { login, loginSchema, register, registerSchema } from '@/services/auth.service';

export const registerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input = registerSchema.parse(req.body);
    const user = await register(input);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input = loginSchema.parse(req.body);
    const result = await login(input);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
