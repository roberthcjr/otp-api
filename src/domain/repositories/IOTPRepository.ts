import type IOTPEntity from '../entities/IOTPEntity';

export default interface IOTPRepository {
  create(email: string, secret: string): Promise<IOTPEntity>;
  findByEmail(email: string): Promise<IOTPEntity | null>;
}
