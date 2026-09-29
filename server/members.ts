export type Group = {
  name: string;
  name_short: string;
  punishment_types: Record<
    string,
    { name: string; emoji: string; value: number }
  >;
  members: {
    user_id: string;
    first_name: string;
    last_name: string;
    active: boolean;
    punishments: {
      punishment_id: string;
      punishment_type_id: string;
      amount: number;
      paid: boolean;
      reason: string;
      reason_hidden: boolean;
      created_at: string;
    }[];
  }[];
};

export type Member = {
  id: string;
  displayName: string;
  unpaidValue: number;
  punishmentCount: number;
  punishments: Punishment[];
};

export type Punishment = {
  id: string;
  name: string;
  emoji: string;
  amount: number;
  value: number;
  reason: string | null;
  createdAt: string;
  paid: boolean;
};

export type Snapshot = { groupName: string; members: Member[] };

export function toMembers(group: Group): Member[] {
  return group.members
    .filter((member) => member.active)
    .map((member) => ({
      id: member.user_id,
      displayName: `${member.first_name} ${member.last_name}`.trim(),
      unpaidValue: member.punishments
        .filter((punishment) => !punishment.paid)
        .reduce(
          (sum, punishment) =>
            sum +
            punishment.amount *
              (group.punishment_types[punishment.punishment_type_id]?.value ??
                0),
          0,
        ),
      punishmentCount: member.punishments.length,
      punishments: member.punishments
        .map((punishment) => {
          const type = group.punishment_types[punishment.punishment_type_id];
          return {
            id: punishment.punishment_id,
            name: type?.name ?? "",
            emoji: type?.emoji ?? "",
            amount: punishment.amount,
            value: punishment.amount * (type?.value ?? 0),
            reason: punishment.reason_hidden ? null : punishment.reason,
            createdAt: punishment.created_at,
            paid: punishment.paid,
          };
        })
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    }))
    .sort(
      (left, right) =>
        right.unpaidValue - left.unpaidValue ||
        left.displayName.localeCompare(right.displayName, "nb"),
    );
}
