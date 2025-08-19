// tests/integration/otp.integration.spec.ts
import envConfig from 'src/infraestructure/config/env';
import { OTPAuthService } from '../../src/infraestructure/services/OTPAuthService';
import { PrismaClient } from 'generated/prisma';
import { PrismaOTPRepository } from 'src/infraestructure/database/PrismaOTPRepository';
import ConventionalLogger from 'src/infraestructure/config/Logger';
import { CreateOTP } from 'src/application/use-cases/CreateOTP';

const API_URL = `http://localhost:${envConfig.express.port}`;

const prisma = new PrismaClient();

const otpRepository = new PrismaOTPRepository(prisma);
const otpService = new OTPAuthService(envConfig);

const createOTPLogger = new ConventionalLogger('Create OTP - TESTS');
const createOTP = new CreateOTP(otpRepository, otpService, createOTPLogger);

beforeEach(async () => {
  await prisma.oTP.deleteMany();
});

describe('OTP API Integration', () => {
  const email = 'integration@test.com';

  test('Given a valid email, When I call /token/generate, Then I should receive an OTP', async () => {
    const response = await fetch(`${API_URL}/token/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    expect(response.status).toBe(201);

    const json = await response.json();
    expect(json).toHaveProperty('email', email);
    expect(json).toHaveProperty('otp');
    expect(typeof json.otp).toBe('string');
  });

  test('Given a valid OTP generated with OTPAuthService, When I call /token/validate, Then I should receive success', async () => {
    // Mock OTP
    const code = await createOTP.execute(email);

    const response = await fetch(`${API_URL}/token/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });

    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toMatchObject({
      email,
      isVerified: true,
    });
  });

  test('Given an invalid OTP code, When I call /token/validate, Then I should receive an error', async () => {
    const response = await fetch(`${API_URL}/token/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        code: '000000', // definitely invalid
      }),
    });

    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json).toHaveProperty('error.code', 'OTP_INVALID');
  });

  test('Given a missing payload, When I call /token/validate, Then I should receive bad request', async () => {
    const response = await fetch(`${API_URL}/token/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(400);
  });
});
