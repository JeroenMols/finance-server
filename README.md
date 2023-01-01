# Finance server
Backend for the [Finance manager](https://github.com/JeroenMols/finance-manager) that provides data storage (e.g. accounts), caching and appends the required CORS headers to requests.

## Getting started
Navigate to the project directory and follow the steps below.

### Setup database
For the server to work, it requires a [PostgreSQL](https://www.postgresql.org/) database.

1. Install PostgreSQL using homebrew: `brew install postgresql`
1. Create the database: `createdb finance_server --port=5432`
1. Initialize the database with the expected tables
  1. From the project root folder, open a shell to the database: `pgcli finance_server`
  1. Run the [init-db.sql](init-db.sql) script: `\i init-db.sql`
  1. Exit the shell: `exit`

### 
In the project directory, run:

- `npm install` to install all dependencies
- `npm run buildStart ` to start the finance server at [http://localhost:4000](http://localhost:4000)
- alternatively `npm run devStart` to start the server with hot reload on code changes

Note that this project requires the [Finance Server](https://github.com/JeroenMols/finance-server) in order to work.

