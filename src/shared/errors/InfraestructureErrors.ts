import { AppError } from './AppErrors';

export class ServiceError extends AppError {
  constructor(cause?: any) {
    super(`Service operation failed`, {
      code: 'SERVICE_ERROR',
      statusCode: 403,
      cause,
    });
  }
}

export class DatabaseError extends AppError {
  constructor(cause?: any) {
    super(`Database operation failed`, {
      code: 'SERVICE_ERROR',
      statusCode: 403,
      cause,
    });
  }
}
