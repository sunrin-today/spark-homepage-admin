export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  studentNumber: number;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  studentNumber: number;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}