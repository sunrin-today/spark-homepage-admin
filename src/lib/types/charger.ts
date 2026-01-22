
import { User } from "./users";

export type ChargerRentalRecord = {
    id: string;
    chargerId: number;
    isReturned: boolean;
    isConfirmed: boolean;
    borrower: User;
    reviewer: User;
    deadline: string;
    createdAt: string;
};

export type Charger = {
    id: string;
    chargerId: number;
    description: string;
    status: string;
    currentRentalRecord: ChargerRentalRecord | null;
};