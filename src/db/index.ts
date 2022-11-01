import { Pool, QueryResult } from 'pg';
import { DATABASE_SSL, DATABASE_URL } from '../config';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ...DATABASE_SSL,
});

module.exports = {
  async query(text: string, params: string[]): Promise<QueryResult> {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  },
};
