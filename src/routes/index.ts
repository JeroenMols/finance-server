import { Application } from 'express';
import account from './account';
import portfolio from './portfolio';
import holding from './holding';
import stocks from './stocks';

const mountRoutes = (app: Application): void => {
  app.use('/account', account);
  app.use('/portfolio', portfolio);
  app.use('/holding', holding);
  app.use('/stocks', stocks);
};

export default mountRoutes;
