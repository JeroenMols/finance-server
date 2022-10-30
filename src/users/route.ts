import express, { Request, Response } from 'express';
import crypto from 'crypto';

const router = express.Router();

// TODO should probably be post
router.get('/create', (req: Request, res: Response): void => {
  res.send(crypto.randomUUID());
});

export default router;
