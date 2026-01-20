
import api from './api';
import { RentalRecord } from '../types/meeting-room';
import { ListResponse } from '../types/common';

const meetingRoomApi = {
    
    getRentalRecords: async (page: number = 1, limit: number = 10, sort: string = 'createdAt', order: string = 'desc') => {
        const response = await api.get<ListResponse<RentalRecord>>('/api/meeting-room', {
            params: { page, limit, sort, order },
        });
        return response.data;
    },
    getRentalRecord: async (id: string) => {
        const response = await api.get<RentalRecord>(`/api/meeting-room/${id}`);
        return response.data;
    }, 

    approveRental: async (id: string) => {
        const response = await api.patch<RentalRecord>(`/api/meeting-room/${id}/approve`);
        return response.data;
    },
    rejectRental: async (id: string) => {
        const response = await api.patch<RentalRecord>(`/api/meeting-room/${id}/reject`);
        return response.data;
    },
}

export default meetingRoomApi;