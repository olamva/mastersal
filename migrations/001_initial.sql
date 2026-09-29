CREATE TABLE IF NOT EXISTS oauth_connection (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  refresh_token_ciphertext bytea NOT NULL,
  refresh_token_nonce bytea NOT NULL,
  refresh_token_tag bytea NOT NULL,
  token_version integer NOT NULL DEFAULT 1,
  authorization_required boolean NOT NULL DEFAULT false,
  authorized_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public_snapshot (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  group_name text NOT NULL,
  group_short_name text NOT NULL,
  group_image text,
  members jsonb NOT NULL,
  synchronized_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
