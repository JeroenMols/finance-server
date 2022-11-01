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
