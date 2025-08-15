import type { IOTPEntity } from 'src/domain/entities/OTPEntity';
import type { IOTPRepository } from 'src/domain/repositories/IOTPRepository';

export interface IFindOTP {
  execute(email: string): Promise<IOTPEntity>;
}

export class FindOTP implements IFindOTP {
  constructor(private otpRepository: IOTPRepository) {}

  execute(email: string): Promise<IOTPEntity> {
    return this.otpRepository.find(email);
  }
}
