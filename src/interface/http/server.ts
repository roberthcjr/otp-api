import * as express from 'express';
import type { IExpressConfig } from 'src/infraestructure/config/env';
import envConfig from 'src/infraestructure/config/env';
import type { ILogger } from 'src/infraestructure/config/logger';
import Logger from 'src/infraestructure/config/logger';
import otpRoutes from './routes/otpRoutes';

interface IServer {
  app: express.Application;
  router: express.Router;
  config: IExpressConfig;
  logger: ILogger;
  listen: () => void;
}

class Server implements IServer {
  public app: express.Application;
  public router: express.Router;
  public config: IExpressConfig;
  public logger: ILogger;

  constructor() {
    this.app = express();
    this.router = express.Router();
    this.config = envConfig.express;
    this.logger = new Logger('Server');
    this.initiateMiddleware();
  }

  initiateMiddleware() {
    this.app.use(express.json());
    this.app.use('/', otpRoutes);
  }

  listen() {
    this.app.listen(this.config.port, () => {
      this.logger.info(`Server up and running on port: ${this.config.port}`);
    });
  }
}

const server = new Server();

export default server;
