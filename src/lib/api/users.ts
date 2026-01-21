import api from "@/lib/api/api";
import type { UserResponse } from "@/lib/types/users";

// 현재 로그인한 사용자 정보 조회
export const getUserInfo = async (): Promise<UserResponse> => {
  const response = await api.get<UserResponse>("/api/users/me");
  return response.data;
};
