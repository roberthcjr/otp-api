// src/interface/http/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from 'src/shared/errors/AppErrors';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
      },
    });
  }

  console.error('[UNKNOW ERROR] (errorHandler):', err);

  return res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  });
}
