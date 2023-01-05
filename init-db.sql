CREATE TABLE account (
  id serial PRIMARY KEY,
  UUID varchar(40) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE login (
  id serial PRIMARY KEY,
  account_id integer NOT NULL,
  access_token varchar(50) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expired_at TIMESTAMP WITH TIME ZONE NOT NULL,
  CONSTRAINT fk_account FOREIGN KEY(account_id) REFERENCES account(id) ON DELETE CASCADE
);
CREATE TABLE holding (
  id serial PRIMARY KEY,
  account_id integer NOT NULL,
  ticker varchar(10) NOT NULL CHECK (upper(ticker) = ticker),
  quantity integer NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_account FOREIGN KEY(account_id) REFERENCES account(id) ON DELETE CASCADE
);
