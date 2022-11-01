import { Pool } from 'pg';

const pool = new Pool({
  user: 'jmols',
  host: 'localhost',
  database: 'finance_server',
  password: '',
  port: 5432,
});

module.exports = {
  query: (text: string, params: string[]) => pool.query(text, params),
};
