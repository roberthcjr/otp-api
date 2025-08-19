export type Algorithms =
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

export default interface IEnvConfig {
  express: IServerConfig;
  otpConfig: IOTPConfig;
}
