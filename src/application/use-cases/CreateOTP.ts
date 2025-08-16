import type { IOTPRepository } from 'src/domain/repositories/IOTPRepository';
import type { IOTPService } from 'src/domain/services/IOTPService';

export interface ICreateOTP {
  execute(email: string): Promise<string>;
}

export class CreateOTP implements ICreateOTP {
  constructor(
    private otpRepository: IOTPRepository,
    private totpService: IOTPService,
  ) {}

  async execute(email: string): Promise<string> {
    let user = await this.otpRepository.find(email);

    if (!user) {
      const secret = this.totpService.generateSecret();
      user = await this.otpRepository.create(email, secret);
    }

    const code = await this.totpService.generateOTP(user.email, user.secret);

    return code;
  }
}
