export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  studentNumber: number;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  studentNumber: number;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  items: User[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface UpdateUserDto {
  role?: UserRole;
  name?: string;
  studentNumber?: number;
}