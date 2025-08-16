import type { IOTPEntity } from '../entities/OTPEntity';

export interface IOTPRepository {
  create(email: string, secret: string): Promise<IOTPEntity>;
  find(email: string): Promise<IOTPEntity | null>;
}
