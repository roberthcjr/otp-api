import { Router } from 'express';
import ConventionalLogger from 'src/infraestructure/config/Logger';
import PrismaOTPRepository from 'src/infraestructure/database/PrismaOTPRepository';
import OTPAuthService from 'src/infraestructure/services/OTPAuthService';
import ExpressController from '../controllers/ExpressController';
import * as swaggerUi from 'swagger-ui-express';
import CreateOTP from 'src/application/use-cases/CreateOTP';
import ValidateOTP from 'src/application/use-cases/ValidateOTP';
import OTPController from '../controllers/OTPController';
import { PrismaClient } from 'generated/prisma';
import * as path from 'path';
import * as fs from 'fs';
import envConfig from 'src/infraestructure/config/DefaultEnvCofig';
const swaggerPath = path.resolve(__dirname, '../../../docs/swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));

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
