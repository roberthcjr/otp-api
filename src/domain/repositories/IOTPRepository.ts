import type IOTPEntity from '../entities/IOTPEntity';

export default interface IOTPRepository {
  create(email: string, secret: string): Promise<IOTPEntity>;
  find(email: string): Promise<IOTPEntity | null>;
}
