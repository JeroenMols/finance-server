import Express, { Request, Response } from 'express';
import { IncomingMessage } from 'http';

import logger from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';

const app = Express();
app.use(logger('dev'));
app.use(compression());
app.use(helmet());

const port = process.env.PORT || 4000;
const cors_origin = process.env.FRONTEND_URL || 'http://localhost:3000';

const corsOptions = {
  origin: cors_origin,
  optionsSuccessStatus: 200, // For legacy browser support
};
app.use(cors(corsOptions));

import https from 'https';

app.get('/stocks/:ticker/:amount', (req: Request, res: Response) => {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

type QuoteData = {
  quoteResponse: {
    result: QuoteResult[];
  };
};

type QuoteResult = {
  regularMarketPrice: string; //should be number
  longName: string;
  symbol: string;
};

type StockData = {
  name: string;
  ticker: string;
  price: number;
  shares: number;
  totalValue: number;
};

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
