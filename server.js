const express = require('express')
const logger = require("morgan");

const app = express()
app.use(logger("dev"))
const port = process.env.PORT || 4000 

const https = require('https');


app.get('/stocks/:ticker', (req, res) => {
  let ticker = req.params.ticker

  https.get('https://query1.finance.yahoo.com/v7/finance/quote?symbols=' + ticker, (resp) => {
  let data = '';

  // A chunk of data has been received.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log(JSON.parse(data));
    res.send(data)
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});



})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
