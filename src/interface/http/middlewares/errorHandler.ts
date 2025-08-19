import { Request, Response, NextFunction } from 'express';
import ConventionalLogger from 'src/infraestructure/config/Logger';
import { AppError } from 'src/shared/errors/AppErrors';
import { OTPInvalidError } from 'src/shared/errors/DomainErrors';

const appLogger = new ConventionalLogger('App Logger');

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  appLogger.error(err.message, err);
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
