import { useQuery } from "@tanstack/react-query";
import chargerRecordAPI from "@/lib/api/charger-record";
import { chargerRentalRecordKeys } from "./keys";

export const getChargerRentalRecordByCharger = (chargerId: string) => {
    return useQuery({
        queryKey: chargerRentalRecordKeys.byCharger(chargerId),
        queryFn: () => chargerRecordAPI.getChargerRentalRecordByCharger(chargerId),
    });
}