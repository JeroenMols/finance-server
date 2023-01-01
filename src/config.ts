export const PORT = process.env.PORT || 4000;
export const CORS_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:3000';

export const DATABASE_URL = process.env.DATABASE_URL || createLocalDbUrl();
// TODO make SSL on production work
export const DATABASE_SSL =
  process.env.NODE_ENV == 'production'
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : null;

function createLocalDbUrl(): string {
  const localDbName = 'finance_server';
  const localDbPort = 5432;
  return `postgresql://@localhost:${localDbPort}/${localDbName}`;
}
