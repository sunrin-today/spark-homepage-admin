import { useQuery } from "@tanstack/react-query";
import { chargerKeys } from "./keys";
import chargerAPI from "@/lib/api/charger";


export const useGetChargers = (params: {page: number, limit?: number, column?: string, orderDirection?: string}, enabled?: boolean) => {
  return useQuery({
    queryKey: chargerKeys.all(),
    queryFn: () =>
      chargerAPI.getChargers(
        params.page,
        params.limit || 10,
        params.column || "chargerId",
        params.orderDirection || "ASC",
      ),
    enabled,
  });
};

export const useGetCharger = (chargerId: string) => {
  return useQuery({
    queryKey: chargerKeys.status(),
    queryFn: () => chargerAPI.getChargerDetailById(chargerId),
  });
};
