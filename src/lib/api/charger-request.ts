
import { ListResponse } from "../types/common";
import { ChargerRentalRequest } from "../types/charger";
import api from "@/lib/api/api"

const chargerRequestApi = {
    getChargerRequests: async (params: {page: number, limit: number, column: string, orderDirection: string}) => {
        const response = await api.get<ListResponse<ChargerRentalRequest>>("/api/rental-request", {params});
        return response.data;
    },
    deleteChargerRequest: async (requestId: string) => {
        const response = await api.delete(`/api/rental-request/${requestId}`);
        return response.data;
    }
}

export default chargerRequestApi;
