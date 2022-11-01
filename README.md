# Postgress

`create table account (id serial primary key, uuid varchar(40) unique not null, created_at TIMESTAMP WITH TIME ZONE NOT NULL default CURRENT_TIMESTAMP);`

`create table login (id serial primary key, account_id integer not null, access_token varchar(50) unique not null, created_at TIMESTAMP WITH TIME ZONE NOT NULL default CURRENT_TIMESTAMP, expired_at TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT fk_account FOREIGN KEY(account_id) references account(id) on delete cascade)`
