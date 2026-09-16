import "server-only";
import { z } from "zod";
import { appEnv } from "@/lib/env";
import type { VinstraffGroup } from "@/lib/types";

const punishmentSchema = z.object({ punishment_type_id: z.string(), amount: z.number(), paid: z.boolean() });
const memberSchema = z.object({ user_id: z.string(), first_name: z.string(), last_name: z.string(), active: z.boolean(), punishments: z.array(punishmentSchema) });
const groupSchema = z.object({
  group_id: z.string(),
  name: z.string(),
  name_short: z.string(),
  image: z.string().optional().default(""),
  members: z.array(memberSchema),
  punishment_types: z.record(z.string(), z.object({ value: z.number() })),
});

async function wait(delay: number) {
  await new Promise((resolve) => setTimeout(resolve, delay));
}

export async function fetchVinstraff<T>(path: string, accessToken: string, schema: z.ZodType<T>) {
  const delays = [0, 250, 1_000];
  for (let attempt = 0; attempt < delays.length; attempt += 1) {
    if (delays[attempt]) await wait(delays[attempt]);
    const response = await fetch(`${appEnv().vinstraffApiUrl}${path}`, { headers: { authorization: `Bearer ${accessToken}`, accept: "application/json" }, cache: "no-store" });
    if (response.ok) return schema.parse(await response.json());
    if (response.status < 500 && response.status !== 429) throw new Error(`Vinstraff request failed with HTTP ${response.status}`);
  }
  throw new Error("Vinstraff request failed after retries");
}

export async function discoverConfiguredGroup(accessToken: string): Promise<VinstraffGroup> {
  const groups = await fetchVinstraff("/groups/me?wait_for_updates=true&optimistic=false", accessToken, z.array(groupSchema));
  const configured = appEnv().groupName.toLowerCase();
  const group = groups.find((item) => item.name_short.toLowerCase() === configured);
  if (!group) throw new Error("Configured Vinstraff group was not found");
  return group;
}

export async function fetchSelectedGroup(accessToken: string, groupId: string) {
  return fetchVinstraff(`/groups/${encodeURIComponent(groupId)}`, accessToken, groupSchema);
}
