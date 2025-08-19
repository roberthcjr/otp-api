import * as OTPAuth from 'otpauth';
import type IOTPService from 'src/domain/services/IOTPService';
import type IEnvConfig from '../config/IEnvConfig';

export default class OTPAuthService implements IOTPService {
  constructor(private config: IEnvConfig) {}

  generateSecret(): string {
    const secret = new OTPAuth.Secret({
      size: this.config.otpConfig.secretSize,
    });

    return secret.base32;
  }

  generateOTP(email: string, secret: string): string {
    const totp = new OTPAuth.TOTP({
      issuer: 'OTPAPI',
      label: email,
      algorithm: this.config.otpConfig.algorithm,
      digits: this.config.otpConfig.digits,
      period: this.config.otpConfig.period,
      secret,
    });

    return totp.generate();
  }

  verifyOTP(email: string, secret: string, code: string): boolean {
    const totp = new OTPAuth.TOTP({
      issuer: 'OTPAPI',
      label: email,
      algorithm: this.config.otpConfig.algorithm,
      digits: this.config.otpConfig.digits,
      period: this.config.otpConfig.period,
      secret,
    });

    const delta = totp.validate({
      token: code,
      window: this.config.otpConfig.window,
    });

    return delta !== null;
  }
}
