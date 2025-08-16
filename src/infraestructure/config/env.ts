type Algorithms =
  | 'SHA1'
  | 'SHA224'
  | 'SHA256'
  | 'SHA384'
  | 'SHA512'
  | 'SHA3-224'
  | 'SHA3-256'
  | 'SHA3-384'
  | 'SHA3-512';

export interface IServerConfig {
  port: number;
}

export interface IOTPConfig {
  period: number;
  secretSize: number;
  algorithm: Algorithms;
  digits: number;
  window: number;
}

export interface IEnvConfig {
  express: IServerConfig;
  otpConfig: IOTPConfig;
}

class EnvConfig implements IEnvConfig {
  public express: IServerConfig;
  public otpConfig: IOTPConfig;
  constructor() {
    this.express = {
      port: Number(process.env.PORT) || 3000,
    };
    this.otpConfig = {
      algorithm: (process.env.ALGORITHM as Algorithms) || 'SHA256',
      digits: Number(process.env.DIGITS) || 6,
      secretSize: Number(process.env.SECRET_SIZE) || 20,
      period: Number(process.env.PERIOD) || 30,
      window: Number(process.env.WINDOW) || 1,
    };
  }
}

const envConfig = new EnvConfig();

export default envConfig;
