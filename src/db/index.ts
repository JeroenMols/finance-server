import { Pool } from 'pg';
import { DATABASE_SSL, DATABASE_URL } from '../config';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ...DATABASE_SSL,
});

module.exports = {
  query: (text: string, params: string[]) => pool.query(text, params),
};
