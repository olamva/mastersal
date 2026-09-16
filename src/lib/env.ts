import "server-only";

export function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export function appEnv() {
  return {
    get issuer() { return process.env.ONLINE_OIDC_ISSUER ?? "https://auth.online.ntnu.no/"; },
    get clientId() { return requiredEnv("ONLINE_CLIENT_ID"); },
    get clientSecret() { return requiredEnv("ONLINE_CLIENT_SECRET"); },
    get encryptionKey() { return requiredEnv("TOKEN_ENCRYPTION_KEY"); },
    get adminSecret() { return requiredEnv("ADMIN_SETUP_SECRET"); },
    get cronSecret() { return requiredEnv("CRON_SECRET"); },
    get databaseUrl() { return requiredEnv("DATABASE_URL"); },
    get vinstraffApiUrl() { return process.env.VINSTRAFF_API_URL ?? "https://api.vinstraff.no"; },
    get groupName() { return process.env.VINSTRAFF_GROUP_NAME ?? "mastersal"; },
  };
}
