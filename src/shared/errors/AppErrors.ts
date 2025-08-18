export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly cause?: unknown;

  constructor(
    message: string,
    options: {
      code?: string;
      statusCode?: number;
      cause?: unknown;
    } = {},
  ) {
    super(message);

    this.name = this.constructor.name;
    this.code = options.code ?? 'APP_ERROR';
    this.statusCode = options.statusCode ?? 500;
    this.cause = options.cause;

    // Mantém stack trace limpo no Node
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
