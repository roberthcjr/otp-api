import * as express from 'express';
import type { IEnvConfig } from 'src/infraestructure/config/env';
import type { ILogger } from 'src/infraestructure/config/logger';
import { errorHandler } from './middlewares/errorHandler';

interface IServer {
  listen: () => void;
}

export class Server implements IServer {
  constructor(
    private app: express.Application,
    private router: express.Router,
    private config: IEnvConfig,
    private logger: ILogger,
  ) {
    this.initiateMiddleware();
  }

  initiateMiddleware() {
    this.app.use(express.json());
    this.app.use('/', this.router);
    this.app.use(errorHandler);
  }

  listen() {
    this.app.listen(this.config.express.port, () => {
      this.logger.info(
        `Server up and running on port: ${this.config.express.port}`,
      );
    });
  }
}
