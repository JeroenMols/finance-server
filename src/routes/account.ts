import { Request, Response } from 'express';
import crypto from 'crypto';

const db = require('../db');

const router = require('express-promise-router')();

router.get('/create', async (req: Request, res: Response): Promise<void> => {
  // TODO setup a proper application secret here
  if (req.body.application_secret !== 'mysecret') {
    console.log('unautorized - wrong secret');
    res.status(401);
    res.send({ error: 'please provide a valid application secret' });
    return;
  }

  const userId = crypto.randomUUID();
  const { rows } = await db.query('INSERT into account(uuid) values ($1)', [userId]);

  console.log(rows);
  res.send(userId);
});

// TODO temporary endpoint needs to be removed
router.get('/debug', async (req: Request, res: Response): Promise<void> => {
  const { rows } = await db.query('SELECT * FROM account');
  console.log(rows);
  res.send(rows);
});

export default router;

type AccountCreate = { application_secret: string };
