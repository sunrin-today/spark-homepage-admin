
import { ListResponse } from "../types/common";
import { ChargerRentalRequest } from "../types/charger";
import api from "@/lib/api/api"

const chargerRequestApi = {
    getChargerRequests: (params: {page: number, limit: number, column: string, orderDirection: string}) => {
        const response = api.get<ListResponse<ChargerRentalRequest>>("/rental-request", {params});
        return response;
    },
    deleteChargerRequest: (requestId: string) => {
        const response = api.delete(`/rental-request/${requestId}`);
        return response;
    }
}

export default chargerRequestApi;
