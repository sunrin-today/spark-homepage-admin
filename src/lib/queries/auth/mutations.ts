import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContexts";
import { authKeys } from "./keys";
import { usersApi } from "@/lib/api/users";

// 구글 로그인 mutation
export const useGoogleLoginMutation = () => {
  const router = useRouter();
  const { login, logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // login()에서 토큰 받기
      const token = await login();
      
      // 사용자 정보 가져오기
      const userData = await usersApi.getMe();
      
      return { token, userData };
    },
    onSuccess: async (data) => {
      const { userData } = data;
      
      // ADMIN 권한 체크
      if (userData.role !== "ADMIN") {
        // ADMIN 아니라면 로그아웃 처리
        await logout();
        queryClient.clear();
        throw new Error("관리자 권한이 필요합니다.");
      }
      
      // 사용자 정보 캐시에 저장
      queryClient.setQueryData(authKeys.me(), userData);
      
      // ADMIN 페이지로 이동
      router.push("/");
    },
    onError: (error: any) => {
      console.error("로그인 실패:", error);
      throw error;
    },
  });
};

// 로그아웃 mutation
export const useLogoutMutation = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      // 모든 쿼리 캐시 초기화
      queryClient.clear();
      router.push("/login");
    },
    onError: (error) => {
      console.error("로그아웃 실패:", error);
    },
  });
};