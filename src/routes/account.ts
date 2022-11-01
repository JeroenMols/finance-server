import { Request, Response } from 'express';
import crypto from 'crypto';

const db = require('../db');

const router = require('express-promise-router')();

router.post('/create', async (req: Request<unused, unused, AccountCreate>, res: Response): Promise<void> => {
  // TODO setup a proper application secret here
  if (req.body.application_secret !== 'mysecret') {
    console.log('unautorized - wrong secret');
    res.status(401);
    res.send({ error: 'please provide a valid application secret' });
    return;
  }

  const account_uuid = crypto.randomUUID();
  const { rows } = await db.query('INSERT into account(uuid) values ($1)', [account_uuid]);

  console.log(rows);
  res.send({ account_uuid: account_uuid });
});

router.post('/login', async (req: Request<unused, unused, AccountLogin>, res: Response): Promise<void> => {
  const accountUuid = req.body.account_uuid;
  if (!accountUuid) {
    console.log('bad request - missing account_id');
    res.status(404);
    res.send({ error: 'please provide a valid account id' });
    return;
  }
  console.log(accountUuid);

  const accountResult = await db.query('SELECT id, uuid, created_at from account where uuid = ($1)', [accountUuid]);
  if (accountResult.rowCount < 1) {
    res.status(401);
    res.send({ error: 'user does not exist' });
    return;
  }

  const accountId = (accountResult.rows[0] as Account).id;
  const accessToken = `access-token-${crypto.randomUUID()}`;
  const expirationDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

  const { rows } = await db.query('INSERT into login(account_id, access_token, expired_at) values ($1, $2, $3)', [
    accountId,
    accessToken,
    expirationDate,
  ]);

  console.log(rows[0]);
  res.send({ access_token: accessToken, expiration_date: expirationDate });
});

// TODO temporary endpoint needs to be removed
router.get('/debug', async (req: Request, res: Response): Promise<void> => {
  const { rows } = await db.query('SELECT * FROM account');
  console.log(rows);
  res.send(rows);
});

export default router;

type AccountCreate = { application_secret: string };
type AccountLogin = { account_uuid: string };

type Account = {
  id: number;
  uuid: string;
  created_at: string;
};
