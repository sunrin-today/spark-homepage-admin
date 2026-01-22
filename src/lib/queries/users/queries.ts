import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";
import { usersKeys } from "./keys";

export const useUsersQuery = (params: {
  page?: number;
  limit?: number;
  column?: string;
  orderDirection?: "ASC" | "DESC";
  query?: string;
}) => {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => usersApi.getUsers(params),
  });
};

export const useMeQuery = () => {
  return useQuery({
    queryKey: usersKeys.me(),
    queryFn: () => usersApi.getMe(),
  });
};