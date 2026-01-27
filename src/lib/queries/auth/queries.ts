import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";
import { authKeys } from "./keys";

// 내 정보 조회 (로그인 후 사용자 정보 가져오기)
export const useMeQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => usersApi.getMe(),
    enabled,
    retry: false,
  });
};