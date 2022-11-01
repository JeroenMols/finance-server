import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { QueryResult } from 'pg';

const db = require('../db');

const router = express.Router();

// TODO should probably be post
router.get('/create', (req: Request, res: Response): void => {
  db.query('SELECT * FROM account').then((it: QueryResult) => {
    console.log(it.rows);
  });
  res.send(crypto.randomUUID());
});

export default router;
