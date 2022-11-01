import Express from 'express';

import logger from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';

const app = Express();
app.use(logger('dev'));
app.use(compression());
app.use(helmet());

import users from './routes/users';
import stocks from './routes/stocks';
app.use('/users', users);
app.use('/stocks', stocks);

const port = process.env.PORT || 4000;
const cors_origin = process.env.FRONTEND_URL || 'http://localhost:3000';

const corsOptions = {
  origin: cors_origin,
  optionsSuccessStatus: 200, // For legacy browser support
};
app.use(cors(corsOptions));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
