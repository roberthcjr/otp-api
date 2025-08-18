// src/shared/errors/AppError.ts

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly cause?: any;

  constructor(message: string, code: string, statusCode = 500, cause?: any) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.cause = cause;

    // Fixes prototype chain on TS
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
