import type IEnvConfig from './IEnvConfig';
import type { Algorithms, IOTPConfig, IServerConfig } from './IEnvConfig';

class DefaultEnvConfig implements IEnvConfig {
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

const envConfig = new DefaultEnvConfig();

export default envConfig;
