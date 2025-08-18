import type { IOTPRepository } from 'src/domain/repositories/IOTPRepository';
import type { IOTPService } from 'src/domain/services/IOTPService';
import { OTPInvalidError } from 'src/shared/errors/DomainErrors';
import { DatabaseError } from 'src/shared/errors/InfraestructureErrors';

export interface IValidateOTP {
  execute(email: string, code: string): Promise<boolean>;
}

export class ValidateOTP implements IValidateOTP {
  constructor(
    private otpRepository: IOTPRepository,
    private totpService: IOTPService,
  ) {}

  async execute(email: string, code: string): Promise<boolean> {
    try {
      let user = await this.otpRepository.find(email);
      if (!user) {
        throw new DatabaseError('User not found');
      }

      const isVerified = await this.totpService.verifyOTP(
        user.email,
        user.secret,
        code,
      );

      if (!isVerified) {
        throw new OTPInvalidError();
      }

      return isVerified;
    } catch (error) {
      if (error instanceof OTPInvalidError) throw error;

      throw new OTPInvalidError(error);
    }
  }
}
