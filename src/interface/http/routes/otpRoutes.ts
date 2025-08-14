// src/interface/http/routes/otpRoutes.ts
import { Router } from 'express';

const router = Router();

router.post('/token/generate', (req, res) => {
  res.status(200).send({ message: 'funcionou' });
});

export default router;
