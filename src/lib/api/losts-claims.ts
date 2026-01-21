import { get } from "http";
import api from "./api";
import { ListResponse } from "../types/common";
import { LostClaim } from "../types/lostClaims";

const lostClaimApi = {
    getLostClaimsByLostId: async (lostId: string) => {
        const response = await api.get<ListResponse<LostClaim>>(`/api/lost-claims/lost/${lostId}`);
        return response.data;
    },
    getMyLostClaims: async () => {
        const response = await api.get<ListResponse<LostClaim>>(`/api/lost-claims/me/completed`);
        return response.data;
    },
    changeLostClaimStatus: async (id: string, status: string, rejectReason?: string) => {
        const response = await api.patch(`/api/lost-claims/${id}/status`, { status, rejectReason });
        return response.data;
    },
    deleteLostClaim: async (id: string) => {
        const response = await api.delete(`/api/lost-claims/${id}`);
        return response.data;
    }
}

export default lostClaimApi;