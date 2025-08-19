import envConfig from './infraestructure/config/DefaultEnvCofig';
import ConventionalLogger from './infraestructure/config/Logger';
import router from './interface/http/routes/otpRoutes';
import { Server } from './interface/http/server';
import * as express from 'express';

const app = express();
const serverLogger = new ConventionalLogger('Server');
const server = new Server(app, router, envConfig, serverLogger);

server.listen();
