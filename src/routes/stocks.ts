import express, { Request, Response } from 'express';
import { IncomingMessage } from 'http';
import https from 'https';

const router = express.Router();

router.get('/:ticker/:amount', (req: Request, res: Response) => {
  const ticker = req.params.ticker;
  const amount = parseInt(req.params.amount);

  https
    .get('https://query1.finance.yahoo.com/v7/finance/quote?symbols=' + ticker, (resp: IncomingMessage) => {
      let data = '';

      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        const resultJson = JSON.parse(data);
        console.log(resultJson);
        const stockData = toStockData(resultJson, amount);
        console.log(stockData);
        res.send(stockData);
      });
    })
    .on('error', (err: { message: string }) => {
      console.log('Error: ' + err.message);
    });
});

router.get('/history/:ticker/:amount', (req: Request, res: Response) => {
  const ticker = req.params.ticker;
  const amount = parseInt(req.params.amount);
  // TODO: ensure day starts on monday
  // TODO: make timeframe dynamic
  https
    .get(
      `https://query1.finance.yahoo.com/v7/finance/download/${ticker}?interval=1wk&period1=1641046381&period2=1672668781`,
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

function toStockData(quoteData: QuoteData, shares: number): StockData {
  const result = quoteData.quoteResponse.result[0];
  const price = parseFloat(result.regularMarketPrice);
  const totalValue = parseFloat((price * shares).toFixed(2));
  return {
    name: result.longName,
    ticker: result.symbol,
    price: parseFloat(price.toFixed(2)),
    shares: shares,
    totalValue: totalValue,
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
