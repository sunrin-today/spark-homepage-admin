import { useQuery } from "@tanstack/react-query";
import chargerRequestApi from "@/lib/api/charger-request";
import { chargerRequestKeys } from "./keys";

export const useChargerRequests = ({page, limit, column, orderDirection}: {page: number, limit: number, column: string, orderDirection: string}, enabled: boolean) => {
    return useQuery({
        queryKey: chargerRequestKeys.list(),
        queryFn: () => chargerRequestApi.getChargerRequests({page, limit, column, orderDirection}),
        enabled,
    });
};