import envConfig from './infraestructure/config/env';
import { globalLogger } from './infraestructure/config/logger';
import app from './interface/http/server';

app.listen(envConfig.express.port, () => {
  globalLogger.info(`Server up and running on port ${envConfig.express.port}`);
});
