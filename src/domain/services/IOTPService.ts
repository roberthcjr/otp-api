export default interface IOTPService {
  generateOTP(email: string, secret: string): string;
  generateSecret(): string;
  verifyOTP(email: string, secret: string, code: string): boolean;
}
