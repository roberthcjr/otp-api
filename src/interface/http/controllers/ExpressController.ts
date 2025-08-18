import type { Request, Response, NextFunction } from 'express';
import type { IOTPController } from './OTPController';
import type { ILogger } from 'src/infraestructure/config/logger';

export class ExpressController {
  constructor(private otpController: IOTPController, private logger: ILogger) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email as unknown as string;

      const otp = await this.otpController.create(email);

      return res.status(201).send(otp);
    } catch (error) {
      this.logger.error(error.message, error);

      next(error);
    }
  }

  async validate(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email as unknown as string;
      const code = req.body.code as unknown as string;
      const response = await this.otpController.validate(email, code);

      return res.status(200).send(response);
    } catch (error) {
      this.logger.error(error.message, error);
      next(error);
    }
  }
}
