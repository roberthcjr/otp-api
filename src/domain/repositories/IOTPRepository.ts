import type { IOTPEntity } from '../entities/OTPEntity';

export interface IOTPRepository {
  create(email: string): Promise<IOTPEntity>;
  find(email: string): Promise<IOTPEntity>;
}
