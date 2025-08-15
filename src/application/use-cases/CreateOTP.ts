import type { IOTPEntity } from 'src/domain/entities/OTPEntity';
import type { IOTPRepository } from 'src/domain/repositories/IOTPRepository';

export interface ICreateOTP {
  execute(email: string): Promise<IOTPEntity>;
}

export class CreateOTP implements ICreateOTP {
  constructor(private otpRepository: IOTPRepository) {}

  execute(email: string): Promise<IOTPEntity> {
    return this.otpRepository.create(email);
  }
}
