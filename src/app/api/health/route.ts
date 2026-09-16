import { databaseIsReady, getSnapshot, getSyncState, hasOAuthConnection } from "@/lib/db";

export async function GET() {
  const database = await databaseIsReady();
  if (!database) return Response.json({ application: "ok", database: "unavailable", oauth: "unknown", lastSuccessfulSynchronization: null, snapshotAgeSeconds: null }, { status: 503 });
  const [oauth, state, snapshot] = await Promise.all([hasOAuthConnection(), getSyncState(), getSnapshot()]);
  return Response.json({
    application: "ok",
    database: "ok",
    oauth: oauth ? "connected" : "authorization_required",
    lastSuccessfulSynchronization: state.lastSuccessAt,
    snapshotAgeSeconds: snapshot ? Math.max(0, Math.floor((Date.now() - new Date(snapshot.synchronizedAt).getTime()) / 1000)) : null,
  });
}
