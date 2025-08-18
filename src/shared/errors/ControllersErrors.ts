import { AppError } from './AppErrors';

export class BadRequestError extends AppError {
  constructor(code: string, details: string) {
    super(`Bad Requesting. Caused by: ${details}`);
  }
}
