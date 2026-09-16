import "server-only";
import { getSyncState, runWithSyncLock, saveSelectedGroup } from "@/lib/db";
import { sanitizeGroup } from "@/lib/sanitize";
import { getAccessToken } from "@/lib/token-service";
import { discoverConfiguredGroup, fetchSelectedGroup } from "@/lib/vinstraff";
export { isSnapshotStale } from "@/lib/sync-policy";

export async function selectConfiguredGroup() {
  const group = await discoverConfiguredGroup(await getAccessToken());
  await saveSelectedGroup(group.group_id, group.name, group.name_short);
  return { id: group.group_id, name: group.name, shortName: group.name_short };
}

export async function synchronize() {
  return runWithSyncLock(async () => {
    let state = await getSyncState();
    if (!state.selectedGroupId) {
      await selectConfiguredGroup();
      state = await getSyncState();
    }
    if (!state.selectedGroupId) throw new Error("Configured Vinstraff group was not selected");
    const group = await fetchSelectedGroup(await getAccessToken(), state.selectedGroupId);
    return { groupName: group.name, groupShortName: group.name_short, groupImage: group.image || null, members: sanitizeGroup(group) };
  });
}
