import { User } from "./users";

export type ChargerRentalRecord = {
    id: string;
    chargerId: number;
    isReturned: boolean;
    borrower: User;
    reviewer: User | null;
    deadline: string;
    createdAt: string;
    returnedAt?: string;
};

export type Charger = {
    id: string;
    chargerId: number;
    description: string;
    status: string;
    currentRentalRecord: ChargerRentalRecord | null;
};

export interface ChargerRecordListResponse {
    items: ChargerRentalRecord[];
    total: number;
    currentPage: number;
    totalPages: number;
}