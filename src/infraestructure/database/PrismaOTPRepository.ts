import type { PrismaClient } from 'generated/prisma';
import type IOTPEntity from 'src/domain/entities/IOTPEntity';
import type IOTPRepository from 'src/domain/repositories/IOTPRepository';

export default class PrismaOTPRepository implements IOTPRepository {
  constructor(private prisma: PrismaClient) {}

  create(email: string, secret: string): Promise<IOTPEntity> {
    return this.prisma.oTP.create({
      data: {
        email,
        secret,
      },
    });
  }

  findByEmail(email: string): Promise<IOTPEntity | null> {
    return this.prisma.oTP.findFirst({
      where: {
        email,
      },
    });
  }
}
