import { Request, Response } from 'express';
import crypto from 'crypto';

const db = require('../db');

const router = require('express-promise-router')();

// TODO should probably be post
router.get('/create', async (req: Request, res: Response): Promise<void> => {
  const userId = crypto.randomUUID();
  const { rows } = db.query('INSERT into account(uuid) values ($1)', [userId]);

  console.log(rows);
  res.send(userId);
});

// TODO temporary endpoint needs to be removed
router.get('/debug', async (req: Request, res: Response): Promise<void> => {
  const { rows } = db.query('SELECT * FROM account');
  console.log(rows);
  res.send(rows);
});

export default router;
