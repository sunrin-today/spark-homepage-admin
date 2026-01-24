import { ListResponse } from "../types/common";
import { RentalRecord } from "../types/meeting-room";
import api from "./api";
const chargerRentalRecordApi = {
    getChargerRentalRecords: () => {
        const response = api.get<ListResponse<RentalRecord>>("/rental-record");
        return response;
    },
    getChargerRentalRecordsByUser: (userId: string) => {
        const response = api.get<ListResponse<RentalRecord>>(`/rental-record/user/${userId}`);
        return response;
    },
    getChargerRentalRecordByCharger: (chargerId: string) => {
        const response = api.get<RentalRecord>(`/rental-record/charger/${chargerId}`);
        return response;
    },
    getChargerRentalRecordById: (recordId: string) => {
        const response = api.get<RentalRecord>(`/rental-record/${recordId}`);
        return response;
    },
    checkChargerRentalRecordReturned: (recordId: string) => {
        const response = api.patch(`/rental-record/${recordId}/returned`);
        return response;
    },
    remindChargerRentalRecord: (recordId: string) => {
        const response = api.post(`/rental-record/${recordId}/remind`);
        return response;
    },
    deleteChargerRentalRecord: (recordId: string) => {
        const response = api.delete(`/rental-record/${recordId}`);
        return response;
    }
}

export default chargerRentalRecordApi;