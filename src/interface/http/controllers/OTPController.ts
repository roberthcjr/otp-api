import type ICreateOTP from 'src/application/use-cases/ICreateOTP';
import type IValidateOTP from 'src/application/use-cases/IValidateOTP';
import type IOTPController from './IOTPController';

export default class OTPController implements IOTPController {
  constructor(
    private createOTP: ICreateOTP,
    private validateOTP: IValidateOTP,
  ) {}

  create(email: string): Promise<string> {
    return this.createOTP.execute(email);
  }

  validate(email: string, code: string): Promise<boolean> {
    return this.validateOTP.execute(email, code);
  }
}
