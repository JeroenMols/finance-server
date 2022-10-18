const express = require('express')
const logger = require("morgan");
const cors = require('cors');

const app = express()
app.use(logger("dev"))

var corsOptions = {
  origin: 'https://finance-manager-jm.herokuapp.com',
  optionsSuccessStatus: 200 // For legacy browser support
}
app.use(cors(corsOptions))

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
