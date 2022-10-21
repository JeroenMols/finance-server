const express = require('express')
const logger = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const cors = require('cors');

const app = express()
app.use(logger("dev"))
app.use(compression())
app.use(helmet())

const port = process.env.PORT || 4000
const cors_origin = process.env.FRONTEND_URL || 'http://localhost:3000'

var corsOptions = {
  origin: cors_origin,
  optionsSuccessStatus: 200 // For legacy browser support
}
app.use(cors(corsOptions))

const https = require('https');

app.get('/stocks/:ticker/:amount', (req, res) => {
  let ticker = req.params.ticker
  let amount = parseInt(req.params.amount)
  
  https.get('https://query1.finance.yahoo.com/v7/finance/quote?symbols=' + ticker, (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      const resultJson = JSON.parse(data)
      console.log(resultJson);
      let stockData = toStockData(resultJson, amount)
      console.log(stockData)
      res.send(stockData)
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function toStockData(quoteData, shares) {
  let result = quoteData.quoteResponse.result[0];
  let price = parseFloat(result.regularMarketPrice)
  let stockData = new StockData(result.longName, 
    result.symbol, 
    parseFloat(price.toFixed(2)), 
    shares,
    parseFloat((price * shares).toFixed(2)));
  return stockData;
}

class StockData {
  constructor(name, ticker, price, shares, totalValue) {
    this.name = name
    this.ticker = ticker
    this.price = price
    this.shares = shares
    this.totalValue = totalValue
  }
}