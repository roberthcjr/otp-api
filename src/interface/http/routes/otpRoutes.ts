// src/interface/http/routes/otpRoutes.ts
import { Router } from 'express';
import { PrismaClient } from 'generated/prisma';
import { CreateOTP } from 'src/application/use-cases/CreateOTP';
import { ValidateOTP } from 'src/application/use-cases/ValidateOTP';
import envConfig from 'src/infraestructure/config/env';
import Logger from 'src/infraestructure/config/logger';
import { PrismaOTPRepository } from 'src/infraestructure/database/PrismaOTPRepository';
import { OTPAuthService } from 'src/infraestructure/services/OTPAuthService';
import { OTPController } from '../controllers/OTPController';
import { ExpressController } from '../controllers/ExpressController';

const prisma = new PrismaClient();

const otpRepository = new PrismaOTPRepository(prisma);
const otpService = new OTPAuthService(envConfig);

const createOTP = new CreateOTP(otpRepository, otpService);
const validateOTP = new ValidateOTP(otpRepository, otpService);

const otpController = new OTPController(createOTP, validateOTP);
const appLogger = new Logger('OTP Api');
const expressController = new ExpressController(otpController, appLogger);

const router = Router();

router.post(
  '/token/generate',
  expressController.create.bind(expressController),
);
router.post(
  '/token/validate',
  expressController.validate.bind(expressController),
);

export default router;
