import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    const err = new Error('Unauthorized: No token provided');
    (err as any).status = 401;
    return next(err);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    const err = new Error('Unauthorized: Invalid token');
    (err as any).status = 401;
    next(err);
  }
};
