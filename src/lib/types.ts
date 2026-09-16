export type PublicMember = {
  id: string;
  displayName: string;
  totalValue: number;
  paidValue: number;
  unpaidValue: number;
  punishmentCount: number;
  imageFilename: string;
  active: boolean;
};

export type PublicSnapshot = {
  groupName: string;
  groupShortName: string;
  groupImage: string | null;
  members: PublicMember[];
  synchronizedAt: string;
};

export type SafeSyncState = {
  status: "not_configured" | "idle" | "syncing" | "error" | "authorization_required";
  selectedGroupId: string | null;
  selectedGroupName: string | null;
  selectedGroupShortName: string | null;
  lastStartedAt: string | null;
  lastSuccessAt: string | null;
  lastErrorAt: string | null;
  lastErrorCode: string | null;
};

export type VinstraffPunishment = {
  punishment_type_id: string;
  amount: number;
  paid: boolean;
};

export type VinstraffMember = {
  user_id: string;
  first_name: string;
  last_name: string;
  active: boolean;
  punishments: VinstraffPunishment[];
};

export type VinstraffGroup = {
  group_id: string;
  name: string;
  name_short: string;
  image?: string;
  members: VinstraffMember[];
  punishment_types: Record<string, { value: number }>;
};
