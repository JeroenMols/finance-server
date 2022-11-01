import Express from 'express';

import logger from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import { CORS_ORIGIN, PORT } from './config';
import mountRoutes from './routes';

const app = Express();
app.use(logger('dev'));
app.use(compression());
app.use(helmet());

mountRoutes(app);

const corsOptions = {
  origin: CORS_ORIGIN,
  optionsSuccessStatus: 200, // For legacy browser support
};
app.use(cors(corsOptions));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
