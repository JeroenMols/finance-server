import { Request, Response } from 'express';

const db = require('../db');

const router = require('express-promise-router')();

router.post('/add', async (req: Request<unused, unused, HoldingAddRequest>, res: Response): Promise<void> => {
  const sessionOrError = await getSession(req.body.access_token);
  if (isError(sessionOrError)) {
    res.status(440);
    res.send(sessionOrError);
  }

  const session = sessionOrError as Session;

  await db.query('insert into holding (account_id, ticker, shares) values ($1, $2, $3)', [
    session.account_id,
    req.body.ticker,
    req.body.amount,
  ]);

  const { rows } = await db.query('select ticker, shares from holding where account_id = $1', [session.account_id]);
  res.send(rows);
});

async function getSession(accessToken: string): Promise<Session | Error> {
  const { rows } = await db.query('select account_id, expired_at from login where access_token = $1', [accessToken]);
  console.log(rows);
  if (rows.length < 1) {
    console.log(`couldn't load a valid session for ${accessToken}`);
    return Error(`No session found for ${accessToken}`);
  }
  const session = rows[0] as Session;

  const expirationDate = Date.parse(session.expired_at);
  if (expirationDate < Date.now()) {
    console.log(`session expired`);
    return Error(`Session expired for ${accessToken}`);
  }

  return session;
}

function isError(object: any): object is Error {
  return (object as Error).message !== undefined;
}

type Session = AccessToken & {
  account_id: number;
  expired_at: string;
};

type HoldingAddRequest = AccessToken & {
  ticker: string;
  amount: number;
};

export default router;
