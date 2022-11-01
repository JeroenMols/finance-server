import Express from 'express';

import logger from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import { CORS_ORIGIN, PORT } from './config';

const app = Express();
app.use(logger('dev'));
app.use(compression());
app.use(helmet());

import users from './routes/account';
import stocks from './routes/stocks';
app.use('/users', users);
app.use('/stocks', stocks);

const corsOptions = {
  origin: CORS_ORIGIN,
  optionsSuccessStatus: 200, // For legacy browser support
};
app.use(cors(corsOptions));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
