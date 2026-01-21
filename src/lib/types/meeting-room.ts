import { User } from "./users";

export type RentalRecord = {
  id: string;
  wantedDate: string;
  borrower: User;
  purpose: string;
  status: number;
  createdAt: string;
};
