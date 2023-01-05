import express, { Request, Response } from 'express';
import { IncomingMessage } from 'http';
import https from 'https';
import { httpsGet } from '../http-promise';

const router = express.Router();

router.get('/:ticker', (req: Request, res: Response) => {
  const ticker = req.params.ticker;

  getStockPrice(ticker)
    .then((stock) => {
      console.log('success');
      res.send(stock);
    })
    .catch((error) => console.log('Error: ' + error.message));
});

export const getStockPrice = async (ticker: string): Promise<StockPriceData> => {
  const data = await httpsGet('https://query1.finance.yahoo.com/v7/finance/quote?symbols=' + ticker);
  const resultJson = JSON.parse(data);
  const stockPrice = toStockPrice(resultJson);
  console.log(stockPrice);
  return stockPrice;
};

type Err = {
  message: string;
};

router.get('/history/:ticker/:amount', (req: Request, res: Response) => {
  const ticker = req.params.ticker;
  const amount = parseInt(req.params.amount);
  // TODO: ensure day starts on monday
  // TODO: make timeframe dynamic
  https
    .get(
      `https://query1.finance.yahoo.com/v7/finance/download/${ticker}?interval=1mo&period1=1641046381&period2=1672668781`,
      (resp: IncomingMessage) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          console.log(data);
          res.send(historyCsvToJson(data, amount));
        });
      }
    )
    .on('error', (err: { message: string }) => {
      console.log('Error: ' + err.message);
    });
});

function toStockPrice(quoteData: QuoteData): StockPriceData {
  const result = quoteData.quoteResponse.result[0];
  const price = parseFloat(result.regularMarketPrice);
  return {
    name: result.longName,
    ticker: result.symbol,
    price: parseFloat(price.toFixed(2)),
  };
}

function historyCsvToJson(csv: string, amount: number) {
  const historyArray = [];
  const lines = csv.split('\n');
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].split(',');
    const price = parseFloat(line[5]);

    // TODO: no price yet for current week, use day price
    if (line[5] === 'null') continue;
    historyArray.push({ date: line[0], price: price, totalValue: price * amount });
  }
  return JSON.stringify(historyArray);
}

export default router;
