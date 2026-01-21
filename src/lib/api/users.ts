import api from "./api";
import { User, UserResponse, UserListResponse, UpdateUserDto } from "../types/users";

export const usersApi = {
  // 사용자 목록 조회
  getUsers: async (params: {
    page?: number;
    limit?: number;
    column?: string;
    orderDirection?: "ASC" | "DESC";
    query?: string;
  }): Promise<UserListResponse> => {
    const response = await api.get("/api/users", { params });
    return response.data;
  },

  // 내 정보 조회
  getMe: async (): Promise<User> => {
    const response = await api.get("/api/users/me");
    return response.data;
  },

  // 사용자 정보 수정
  updateUser: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await api.patch(`/api/users/${id}`, data);
    return response.data;
  },

  // 사용자 삭제
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/api/users/${id}`);
  },
};

// 현재 로그인한 사용자 정보 조회 
export const getUserInfo = async (): Promise<UserResponse> => {
  const response = await api.get<UserResponse>("/api/users/me");
  return response.data;
};