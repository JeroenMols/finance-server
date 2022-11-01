import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { QueryResult } from 'pg';

const db = require('../db');

const router = express.Router();

// TODO should probably be post
router.get('/create', (req: Request, res: Response): void => {
  const userId = crypto.randomUUID();
  db.query('INSERT into account(uuid) values ($1)', [userId]).then((it: QueryResult) => {
    console.log(it.rows);
    res.send(userId);
  });
});

// TODO temporary endpoint needs to be removed
router.get('/get', (req: Request, res: Response): void => {
  db.query('SELECT * FROM account').then((it: QueryResult) => {
    console.log(it.rows);
    res.send(it.rows);
  });
});

export default router;
