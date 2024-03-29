import { Request, Response } from 'express';
import { getStockPrice } from './stocks';

const db = require('../db');

const router = require('express-promise-router')();

router.post('/get', async (req: Request<unused, unused, AccessToken>, res: Response): Promise<void> => {
  console.log('portfolio');
  console.log(req.body.access_token);
  const sessionOrError = await getSession(req.body.access_token);
  if (isError(sessionOrError)) {
    res.status(440);
    res.send(sessionOrError);
    return;
  }

  const session = sessionOrError as Session;
  // TODO support errors during portfolio load
  const portfolio = await loadPortfolio(session.account_id);
  res.send(portfolio);
});

router.post('/add', async (req: Request<unused, unused, HoldingAddRequest>, res: Response): Promise<void> => {
  const sessionOrError = await getSession(req.body.access_token);
  if (isError(sessionOrError)) {
    res.status(440);
    res.send(sessionOrError);
  }

  const session = sessionOrError as Session;

  // TODO verify whether ticker is valid

  await db.query('insert into holding (account_id, ticker, quantity) values ($1, $2, $3)', [
    session.account_id,
    req.body.ticker.toUpperCase(),
    req.body.quantity,
  ]);

  // TODO support errors during portfolio load
  const portfolio = await loadPortfolio(session.account_id);
  res.send(portfolio);
});

async function loadPortfolio(account_id: number) {
  const { rows } = await db.query('select ticker, quantity from holding where account_id = $1', [account_id]);

  const holdings = rows as { ticker: string; quantity: number }[];
  const getStockPromises: Promise<StockPriceData>[] = [];
  for (let i = 0; i < holdings.length; i++) {
    console.log('loading stock: ' + holdings[i].ticker);
    getStockPromises.push(getStockPrice(holdings[i].ticker));
  }
  const stockPrices = await Promise.all(getStockPromises);
  const stockPricesMap = new Map(stockPrices.map((stockPrice) => [stockPrice.ticker, stockPrice]));

  const portfolioValueRaw = holdings.reduce((prev, next) => {
    const stock = stockPricesMap.get(next.ticker);
    if (stock === undefined) {
      // TODO better error handling
      console.log('This should never happen: ' + next.ticker);
    }
    return prev + next.quantity * stock!.price;
  }, 0);
  const portfolioValue = parseFloat(portfolioValueRaw.toFixed(2));

  const stocks = holdings.map((holding) => {
    const stockPrice = stockPricesMap.get(holding.ticker);
    if (stockPrice === undefined) {
      console.log('This should never happen');
      return;
    }

    const value = parseFloat((stockPrice.price * holding.quantity).toFixed(2));
    const relativeValue = parseFloat((value / portfolioValue).toFixed(2));
    return {
      stock_id: 1, // TODO
      name: stockPrice.name,
      ticker: stockPrice.ticker,
      price: stockPrice.price,
      quantity: holding.quantity,
      value: value,
      relativeValue: relativeValue,
    };
  });
  return { value: portfolioValue, stocks: stocks };
}

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

type Holding = {
  ticker: string;
  quantity: number;
};

type HoldingAddRequest = AccessToken & Holding;

export default router;
