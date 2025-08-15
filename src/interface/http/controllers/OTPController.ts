import type { ICreateOTP } from 'src/application/use-cases/CreateOTP';
import type { IFindOTP } from 'src/application/use-cases/FindOTP';
import type { IOTPEntity } from 'src/domain/entities/OTPEntity';

export interface IOTPController {
  create(email: string): Promise<IOTPEntity>;
  find(email: string): Promise<IOTPEntity>;
}

export class OTPController implements IOTPController {
  constructor(private createOTP: ICreateOTP, private findOTP: IFindOTP) {}

  create(email: string): Promise<IOTPEntity> {
    return this.createOTP.execute(email);
  }

  find(email: string): Promise<IOTPEntity> {
    return this.findOTP.execute(email);
  }
}
