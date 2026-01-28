import { ListResponse } from "../types/common";
import { ChargerRentalRecord } from "../types/charger";
import api from "./api";
const chargerRentalRecordApi = {
    getChargerRentalRecords: () => {
        const response = api.get<ListResponse<ChargerRentalRecord>>("/api/rental-record");
        return response;
    },
    getChargerRentalRecordsByUser: (userId: string) => {
        const response = api.get<ListResponse<ChargerRentalRecord>>(`/api/rental-record/user/${userId}`);
        return response;
    },
    getChargerRentalRecordByCharger: (chargerId: string) => {
        const response = api.get<ListResponse<ChargerRentalRecord>>(`/api/rental-record/charger/${chargerId}`);
        return response;
    },
    getChargerRentalRecordById: (recordId: string) => {
        const response = api.get<ChargerRentalRecord>(`/api/rental-record/${recordId}`);
        return response;
    },
    checkChargerRentalRecordReturned: (recordId: string) => {
        const response = api.patch(`/api/rental-record/${recordId}/returned`);
        return response;
    },
    remindChargerRentalRecord: (recordId: string) => {
        const response = api.post(`/api/rental-record/${recordId}/remind`);
        return response;
    },
    deleteChargerRentalRecord: (recordId: string) => {
        const response = api.delete(`/api/rental-record/${recordId}`);
        return response;
    }
}

export default chargerRentalRecordApi;