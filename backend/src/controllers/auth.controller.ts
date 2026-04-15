import type { Request, Response } from 'express';
import { login, type LoginInput, register, type RegisterInput } from '@/services/auth.service';

export const registerHandler = async (req: Request, res: Response) => {
  const input: RegisterInput = req.body;
  const user = await register(input);
  res.status(201).json(user);
};

export const loginHandler = async (req: Request, res: Response) => {
  const input: LoginInput = req.body;
  const result = await login(input);
  res.status(200).json(result);
};
