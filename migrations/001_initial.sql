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

CREATE TABLE IF NOT EXISTS oauth_flow (
  state_hash text PRIMARY KEY,
  nonce_ciphertext bytea NOT NULL,
  nonce_nonce bytea NOT NULL,
  nonce_tag bytea NOT NULL,
  verifier_ciphertext bytea NOT NULL,
  verifier_nonce bytea NOT NULL,
  verifier_tag bytea NOT NULL,
  expires_at timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS sync_state (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  status text NOT NULL DEFAULT 'not_configured',
  selected_group_id text,
  selected_group_name text,
  selected_group_short_name text,
  last_started_at timestamptz,
  last_success_at timestamptz,
  last_error_at timestamptz,
  last_error_code text,
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

INSERT INTO sync_state (singleton) VALUES (true) ON CONFLICT (singleton) DO NOTHING;
