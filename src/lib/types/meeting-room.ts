export type RentalRecord = {
  id: string;
  wantedDate: string;
  borrower: {
    id: string;
    email: string;
    name: string;
    avatarUrl: string;
    studentNumber: number;
    role: string;
    createdAt: string;
    updatedAt: string;
  }; //TODO: User 타입으로 변경
  purpose: string;
  status: number;
  createdAt: string;
};
