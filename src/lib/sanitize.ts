import { findMemberImage } from "@/lib/images";
import type { PublicMember, VinstraffGroup, VinstraffMember } from "@/lib/types";

export function calculateMember(member: VinstraffMember, punishmentTypes: VinstraffGroup["punishment_types"]): PublicMember {
  const displayName = `${member.first_name} ${member.last_name}`.trim();
  const values = member.punishments.map((punishment) => ({
    paid: punishment.paid,
    value: punishment.amount * (punishmentTypes[punishment.punishment_type_id]?.value ?? 0),
  }));
  return {
    id: member.user_id,
    displayName,
    totalValue: values.reduce((sum, item) => sum + item.value, 0),
    paidValue: values.filter((item) => item.paid).reduce((sum, item) => sum + item.value, 0),
    unpaidValue: values.filter((item) => !item.paid).reduce((sum, item) => sum + item.value, 0),
    punishmentCount: member.punishments.length,
    imageFilename: findMemberImage(member.user_id, displayName),
    active: member.active,
  };
}

export function sanitizeGroup(group: VinstraffGroup) {
  return group.members
    .filter((member) => member.active)
    .map((member) => calculateMember(member, group.punishment_types))
    .sort((left, right) => right.totalValue - left.totalValue || left.displayName.localeCompare(right.displayName, "nb"));
}
