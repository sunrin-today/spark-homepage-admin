import api from "./api";

const chargerApi =  {
    // 충전기 목록 가져오기
    getChargers: async (page: number, limit: number, column: string, orderDirection: string) => {
        const response = await api.get(`/api/charger`, {
            params: {
                page, limit, column, orderDirection
            }
        });
        return response.data;
    },

    // 아이디로 충전기 정보 가져오기
    getChargerDetailById: async (id: string) => {
        const response = await api.get(`/api/charger/${id}`);
        return response.data;
    },
    getChargerDetailbychargerId: async (chargerId: string) => {
        const response = await api.get(`/api/charger/chargerId/${chargerId}`);
        return response.data;
    },
    changeChargerDescription: async (id: string, description: string) => {
        const response = await api.put(`/api/charger/${id}`, { description });
        return response.data;
    },
    changeChargerStatus: async (id: string, status: string, rentalRequestId?: string) => {
        const response = await api.patch(`/api/charger/${id}`, { status : status, rentalRequestId : rentalRequestId });
        
        return response.data;
    },
    // 충전기 생성
    createCharger: async (charger: any) => {
        const response = await api.post(`/api/charger`, charger);
        return response.data;
    }
}
export default chargerApi;