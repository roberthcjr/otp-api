import { AppError } from './AppErrors';

export class OTPInvalidError extends AppError {
  constructor(cause?: any) {
    super('OTP is invalid', 'OTP_INVALID', 400, cause);
  }
}
