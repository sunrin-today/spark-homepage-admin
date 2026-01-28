import { User } from "./users";

export type LostClaim = {
  id: string;
  lostId: string;
  user: User;
  status: "REJECTED" | "WAITING" | "COMPLETED";
  claimedAt: string;
  deliveredAt: string | null;
  rejectReason: string | null;
};
