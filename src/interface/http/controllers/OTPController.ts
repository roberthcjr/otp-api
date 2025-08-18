import type { ICreateOTP } from 'src/application/use-cases/CreateOTP';
import type { IValidateOTP } from 'src/application/use-cases/ValidateOTP';

export interface IOTPController {
  create(email: string): Promise<string>;
  validate(email: string, code: string): Promise<{ success: boolean }>;
}

export class OTPController implements IOTPController {
  constructor(
    private createOTP: ICreateOTP,
    private validateOTP: IValidateOTP,
  ) {}

  create(email: string): Promise<string> {
    return this.createOTP.execute(email);
  }

  validate(email: string, code: string): Promise<{ success: boolean }> {
    return this.validateOTP.execute(email, code);
  }
}
