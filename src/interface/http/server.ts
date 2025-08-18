import * as express from 'express';
import type { IEnvConfig } from 'src/infraestructure/config/env';
import type { ILogger } from 'src/infraestructure/config/logger';
import { errorHandler } from './middlewares/errorHandler';
import rateLimit from 'express-rate-limit';

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
    const limiter = rateLimit({
      windowMs: 5 * 60 * 1000, // 5 minutes
      limit: 100, // Limit each IP to 100 requests per `window` (here, per 5 minutes).
      standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
      ipv6Subnet: 52,
    });

    this.app.use(limiter);
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
