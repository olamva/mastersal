CREATE TABLE IF NOT EXISTS first_month (
  month text PRIMARY KEY CHECK (month ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  counts jsonb NOT NULL
);
