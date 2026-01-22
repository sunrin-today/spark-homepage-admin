import api from "./api";

const chargerApi =  {
    // 충전기 목록 가져오기
    getChargers: async ({page, limit, column, orderDirection}: {page: number, limit: number, column: string, orderDirection: string}) => {
        const response = await api.get(`/api/charger/charger`, {
            params: {
                page, limit, column, orderDirection
            }
        });
        return response.data;
    },

    // 아이디로 충전기 정보 가져오기
    getChargerDetailById: async (chargerId: string) => {
        const response = await api.get(`/api/charger/${chargerId}`);
        return response.data;
    },
    // 충전기의 대여기록
    getChargerRecordsById: async (chargerId: string) => {
        const response = await api.get(`/api/charger/${chargerId}/records`);
        return response.data;
    },
    getMyActiveChargerRecord: async () => {
        const response = await api.get(`/api/charger/my/active`);
        return response.data;
    },
    // 충전기 생성
    createCharger: async (charger: any) => {
        const response = await api.post(`/api/charger`, charger);
        return response.data;
    }
}
export default chargerApi;