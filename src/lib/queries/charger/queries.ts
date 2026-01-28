import { useQuery } from "@tanstack/react-query";
import { chargerKeys } from "./keys";
import chargerAPI from "@/lib/api/charger";


export const useGetChargers = (params: {page: number, limit: number, column: string, orderDirection: string}, enabled?: boolean) => {
  return useQuery({
    queryKey: chargerKeys.statusList(params),
    queryFn: () =>
      chargerAPI.getChargers(
        params.page,
        params.limit,
        params.column,
        params.orderDirection || "ASC",
      ),
    enabled,
  });
};

export const useGetChargerByChargerId = (chargerId: string) => {
  return useQuery({
    queryKey: chargerKeys.detail(chargerId),
    queryFn: () => chargerAPI.getChargerDetailbychargerId(chargerId),
  });
};
