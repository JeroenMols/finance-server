import Express from 'express';

import bodyParser from 'body-parser';
import logger from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import { CORS_ORIGIN, PORT } from './config';
import mountRoutes from './routes';

const app = Express();
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(compression());
app.use(helmet());

const corsOptions = {
  origin: CORS_ORIGIN,
  optionsSuccessStatus: 200, // For legacy browser support
};
app.use('*', cors(corsOptions));

mountRoutes(app);
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
