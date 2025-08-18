import { AppError } from './AppErrors';

export class ServiceError extends AppError {
  constructor(cause?: any) {
    super(`Service operation failed`, 'SERVICE_ERROR', 403, cause);
  }
}

export class DatabaseError extends AppError {
  constructor(cause?: any) {
    super(`Database operation failed`, 'SERVICE_ERROR', 403, cause);
  }
}
