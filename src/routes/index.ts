import { Application } from 'express';
import account from './account';
import stocks from './stocks';

const mountRoutes = (app: Application): void => {
  app.use('/account', account);
  app.use('/stocks', stocks);
};

export default mountRoutes;
