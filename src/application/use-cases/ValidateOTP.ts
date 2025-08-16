import type { IOTPRepository } from 'src/domain/repositories/IOTPRepository';
import type { IOTPService } from 'src/domain/services/IOTPService';

export interface IValidateOTP {
  execute(email: string, code: string): Promise<boolean>;
}

export class ValidateOTP implements IValidateOTP {
  constructor(
    private otpRepository: IOTPRepository,
    private totpService: IOTPService,
  ) {}

  async execute(email: string, code: string): Promise<boolean> {
    let user = await this.otpRepository.find(email);
    if (!user) {
      throw new Error('User not registered');
    }

    const isVerified = await this.totpService.verifyOTP(
      user.email,
      user.secret,
      code,
    );

    return isVerified;
  }
}
