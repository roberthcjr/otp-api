import { AppError } from './AppErrors';

export class OTPInvalidError extends AppError {
  constructor(cause?: any) {
    super('OTP is invalid', { code: 'OTP_INVALID', statusCode: 400, cause });
  }
}
