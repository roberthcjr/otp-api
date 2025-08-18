// src/interface/http/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from 'src/shared/errors/AppErrors';
import { OTPInvalidError } from 'src/shared/errors/DomainErrors';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof OTPInvalidError)
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
      },
    });

  const publicError = new AppError('Internal Server Error');

  return res.status(publicError.statusCode).json({
    error: {
      message: publicError.message,
      code: publicError.code,
    },
  });
}
