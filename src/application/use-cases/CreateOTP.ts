import { ServiceError } from 'src/shared/errors/InfraestructureErrors';
import type ICreateOTP from './ICreateOTP';
import type IOTPRepository from 'src/domain/repositories/IOTPRepository';
import type IOTPService from 'src/domain/services/IOTPService';
import type ILogger from 'src/infraestructure/config/ILogger';

export default class CreateOTP implements ICreateOTP {
  constructor(
    private otpRepository: IOTPRepository,
    private totpService: IOTPService,
    private logger: ILogger,
  ) {}

  async execute(email: string): Promise<string> {
    try {
      let user = await this.otpRepository.find(email);

      if (!user) {
        this.logger.info(
          `Email - ${email} - is not registered. Registering...`,
        );
        const secret = this.totpService.generateSecret();
        user = await this.otpRepository.create(email, secret);
      }

      const code = await this.totpService.generateOTP(user.email, user.secret);

      return code;
    } catch (error) {
      throw new ServiceError(error);
    }
  }
}
