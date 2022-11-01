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

export default router;
