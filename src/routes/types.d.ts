// Alias to shorten the express POST syntax
type unused = Record<string, unknown>;

type AccessToken = {
  access_token: string;
};

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

type StockPriceData = {
  name: string;
  ticker: string;
  price: number;
};
