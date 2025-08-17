import envConfig from './infraestructure/config/env';
import Logger from './infraestructure/config/logger';
import router from './interface/http/routes/otpRoutes';
import { Server } from './interface/http/server';
import * as express from 'express';

const app = express();
const serverLogger = new Logger('Server');
const server = new Server(app, router, envConfig, serverLogger);

server.listen();
