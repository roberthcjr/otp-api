import { Router } from 'express';
import { PrismaClient } from 'generated/prisma';
import envConfig from 'src/infraestructure/config/DefaultEnvCofig';
import ConventionalLogger from 'src/infraestructure/config/Logger';
import PrismaOTPRepository from 'src/infraestructure/database/PrismaOTPRepository';
import OTPAuthService from 'src/infraestructure/services/OTPAuthService';
import ExpressController from '../controllers/ExpressController';
import * as swaggerUi from 'swagger-ui-express';
import CreateOTP from 'src/application/use-cases/CreateOTP';
import ValidateOTP from 'src/application/use-cases/ValidateOTP';
import OTPController from '../controllers/OTPController';
const swaggerDocument = require('src/docs/swagger.json');

const prisma = new PrismaClient();

const otpRepository = new PrismaOTPRepository(prisma);
const otpService = new OTPAuthService(envConfig);

const createOTPLogger = new ConventionalLogger('Create OTP');
const createOTP = new CreateOTP(otpRepository, otpService, createOTPLogger);
const validateOTP = new ValidateOTP(otpRepository, otpService);

const otpController = new OTPController(createOTP, validateOTP);
const expressController = new ExpressController(otpController);

const router = Router();

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.post(
  '/token/generate',
  expressController.create.bind(expressController),
);
router.post(
  '/token/validate',
  expressController.validate.bind(expressController),
);

export default router;
