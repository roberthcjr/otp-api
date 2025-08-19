import type { Request, Response, NextFunction } from 'express';
import type { IOTPController } from './OTPController';

export class ExpressController {
  constructor(private otpController: IOTPController) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email as unknown as string;

      const otp = await this.otpController.create(email);

      return res.status(201).send({
        email,
        otp,
      });
    } catch (error) {
      next(error);
    }
  }

  async validate(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email as unknown as string;
      const code = req.body.code as unknown as string;
      const isVerified = await this.otpController.validate(email, code);

      return res.status(200).send({
        email,
        isVerified,
      });
    } catch (error) {
      next(error);
    }
  }
}
