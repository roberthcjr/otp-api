import * as OTPAuth from 'otpauth';
import OTPAuthService from 'src/infraestructure/services/OTPAuthService';

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe('OTPAuthService tests', () => {
  const otpAuthService = new OTPAuthService({
    otpConfig: {
      algorithm: 'SHA1',
      digits: 6,
      period: 100,
      secretSize: 2,
      window: 20,
    },
    express: {
      port: 2222,
    },
  });

  it('should return a string with size of 4', () => {
    const secret = otpAuthService.generateSecret();
    expect(typeof secret).toBe('string');
    expect(secret.length).toBe(4);
  });

  describe('generateOTP tests', () => {
    const secret = '4TZ2';
    it('giving an email, should return a six digit code', () => {
      const validEmail = 'xxx@xxxx.xxx.xx';
      const totpMock = new OTPAuth.TOTP({
        issuer: 'OTPAPI',
        label: validEmail,
        algorithm: 'SHA1',
        digits: 6,
        period: 100,
        secret,
      });

      jest.spyOn(OTPAuth, 'TOTP').mockImplementation(() => totpMock);
      jest.spyOn(totpMock, 'generate').mockReturnValue(`123456`);

      const code = otpAuthService.generateOTP(validEmail, secret);
      expect(code).toBe(`123456`);
    });
  });

  describe('verifyOTP tests', () => {
    const secret = '2YI3';
    const emailToGenerateCode = 'generate@generate.com.br';
    it('giving a valid code, should return true', () => {
      const validCode = '123456';

      jest.spyOn(OTPAuth.TOTP.prototype, 'validate').mockReturnValue(0);

      expect(
        otpAuthService.verifyOTP(emailToGenerateCode, secret, validCode),
      ).toBe(true);
    });

    it('giving a invalid code, should return false', () => {
      expect(
        otpAuthService.verifyOTP(emailToGenerateCode, secret, 'abcdef'),
      ).toBeFalsy();
    });
  });
});
