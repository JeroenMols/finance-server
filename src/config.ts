export const PORT = process.env.PORT || 4000;
export const CORS_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:3000';

export const DATABASE_URL = process.env.DATABASE_URL || createLocalDbUrl();
('localhost');

function createLocalDbUrl(): string {
  const localDbName = 'finance_server';
  const localDbUser = 'jmols';
  const localDbPort = 5432;
  return `postgresql://${localDbUser}@localhost:${localDbPort}/${localDbName}`;
}
