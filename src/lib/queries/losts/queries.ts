// lib/queries/losts/queries.ts
import { useQuery } from "@tanstack/react-query";
import lostApi from "@/lib/api/losts";
import { lostKeys } from "./keys";

export function useLostListQuery(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "FOUND" | "COLLECTED";
}) {
  return useQuery({
    queryKey: lostKeys.list(params),
    queryFn: () => {
      console.log(params);
      return lostApi.getLosts(params.page || 1, params.limit || 10, params.search);
    },
    placeholderData: (previousData) => previousData, // ✅ 페이지 전환 UX
  });
}

export function useLostDetailQuery(id: string) {
  return useQuery({
    queryKey: lostKeys.detail(id),
    queryFn: () => lostApi.getLost(id),
    enabled: !!id,
  });
}
