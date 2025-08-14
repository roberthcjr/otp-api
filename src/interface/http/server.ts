import * as express from 'express';
import type { IExpressConfig } from 'src/infraestructure/config/env';
import envConfig from 'src/infraestructure/config/env';
import type { ILogger } from 'src/infraestructure/config/logger';
import Logger from 'src/infraestructure/config/logger';

interface IServer {
  app: express.Application;
  config: IExpressConfig;
  logger: ILogger;
  listen: () => void;
}

class Server implements IServer {
  public app: express.Application;
  public config: IExpressConfig;
  public logger: ILogger;

  constructor() {
    this.app = express();
    this.config = envConfig.express;
    this.logger = new Logger('Server');
    this.initiateMiddleware();
  }

  initiateMiddleware() {}

  listen() {
    this.app.listen(this.config.port, () => {
      this.logger.info(`Server up and running on port: ${this.config.port}`);
    });
  }
}

const server = new Server();

export default server;
