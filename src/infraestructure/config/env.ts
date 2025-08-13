interface IExpressConfig {
  port: number;
}

interface IEnvConfig {
  express: IExpressConfig;
}

class EnvConfig implements IEnvConfig {
  public express: IExpressConfig;
  constructor() {
    this.express = {
      port: Number(process.env.PORT) || 3000,
    };
  }
}

const envConfig = new EnvConfig();

export default envConfig;
