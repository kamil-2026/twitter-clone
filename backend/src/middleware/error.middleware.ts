import { ZodError } from 'zod';
import type { NextFunction, Request, Response } from 'express';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Validation failed',
      errors: err.issues.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      message: 'Invalid JSON format',
    });
    return;
  }

  const statusCode = err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    message:
      statusCode === 500 && isProduction
        ? 'Internal Server Error'
        : err.message || 'Internal Server Error',
  });
};
