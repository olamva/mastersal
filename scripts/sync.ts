async function main() {
  const secret = process.env.CRON_SECRET;
  const baseUrl = process.env.SYNC_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);
  if (!secret || !baseUrl) throw new Error("CRON_SECRET and SYNC_URL or VERCEL_PROJECT_PRODUCTION_URL are required");
  const response = await fetch(`${baseUrl}/api/cron/sync`, { headers: { authorization: `Bearer ${secret}` } });
  if (!response.ok) throw new Error(`Synchronization failed with HTTP ${response.status}`);
  process.stdout.write("Synchronization completed.\n");
}

void main();
