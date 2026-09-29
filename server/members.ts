export type Group = {
  name: string;
  name_short: string;
  punishment_types: Record<string, { value: number }>;
  members: { user_id: string; first_name: string; last_name: string; active: boolean; punishments: { punishment_type_id: string; amount: number; paid: boolean }[] }[];
};

export type Member = { id: string; displayName: string; unpaidValue: number; punishmentCount: number };

export type Snapshot = { groupName: string; members: Member[] };

export function toMembers(group: Group): Member[] {
  return group.members
    .filter((member) => member.active)
    .map((member) => ({
      id: member.user_id,
      displayName: `${member.first_name} ${member.last_name}`.trim(),
      unpaidValue: member.punishments.filter((punishment) => !punishment.paid).reduce((sum, punishment) => sum + punishment.amount * (group.punishment_types[punishment.punishment_type_id]?.value ?? 0), 0),
      punishmentCount: member.punishments.length,
    }))
    .sort((left, right) => right.unpaidValue - left.unpaidValue || left.displayName.localeCompare(right.displayName, "nb"));
}
