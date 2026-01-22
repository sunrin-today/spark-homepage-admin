import { useQuery } from "@tanstack/react-query";
import { chargerKeys } from "./keys";
import chargerAPI from "@/lib/api/charger";


export const useGetChargers = (page: number, enabled: boolean) => {
  return useQuery({
    queryKey: chargerKeys.all(),
    queryFn: () =>
      chargerAPI.getChargers({
        page,
        limit: 10,
        column: "chargerId",
        orderDirection: "ASC",
      }),
    enabled,
  });
};

export const useGetCharger = (chargerId: string) => {
  return useQuery({
    queryKey: chargerKeys.status(),
    queryFn: () => chargerAPI.getChargerDetailById(chargerId),
  });
};
