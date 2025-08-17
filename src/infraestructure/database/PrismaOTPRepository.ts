import type { PrismaClient } from 'generated/prisma';
import type { IOTPEntity } from 'src/domain/entities/OTPEntity';
import type { IOTPRepository } from 'src/domain/repositories/IOTPRepository';

export class PrismaOTPRepository implements IOTPRepository {
  constructor(private prisma: PrismaClient) {}

  create(email: string, secret: string): Promise<IOTPEntity> {
    return this.prisma.oTP.create({
      data: {
        email,
        secret,
      },
    });
  }

  find(email: string): Promise<IOTPEntity | null> {
    return this.prisma.oTP.findFirst({
      where: {
        email,
      },
    });
  }
}
