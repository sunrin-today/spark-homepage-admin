import api from './api';
import { ListResponse } from '../types/common';
import { Lost, LostCreateRequest, LostUpdateRequest } from '../types/losts';

const lostsApi = {
    getLosts: async (page: number = 1, limit: number = 8, search?: string) => {
        const response = await api<ListResponse<Lost>>('/api/lost', {
            params: { page, limit, search },
        });
        console.log("/lost?page=" + page + "&limit=" + limit + "&search=" + search);
        console.log(response);
        return response.data;
    },
    getLost: async (id: string) => {
        const response = await api<Lost>(`/api/lost/${id}`);
        return response.data;
    },
    createLost: async (lostData: LostCreateRequest) => {
        const formData = new FormData();
        formData.append("title", lostData.title);
        formData.append("description", lostData.description);
        formData.append("location", lostData.location);
        formData.append("foundDate", new Date(lostData.foundDate).toISOString());

        if (lostData.thumbnail) {
            formData.append("thumbnail", lostData.thumbnail);
        }
        if (lostData.detailImages) {
            lostData.detailImages.forEach((file) => {
                formData.append("detailImages", file);
            });
        }
        const response = await api.post('/api/lost', 
             formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        return response.data;
    },
    updateLost: async (id: string, lostData: LostUpdateRequest) => {
        const formData = new FormData();

        formData.append("title", lostData.title);
        formData.append("description", lostData.description);
        formData.append("location", lostData.location);
        formData.append("foundDate", lostData.foundDate);

        if (lostData.thumbnail !== null) {
            formData.append('thumbnail', lostData.thumbnail);
        }
        else {
            formData.append('thumbnail', "null");
        }
        formData.append("exists", JSON.stringify(lostData.exists));
        formData.append('imageIndexes', JSON.stringify(lostData.imageIndexs));
        formData.append('deletes', JSON.stringify(lostData.deletes));

        if (lostData.newImages?.length) {
            lostData.newImages.forEach((file) => {
                if (file instanceof File) {
                    formData.append('newImages', file);
                }
            });
        }
        const response = await api.put(`/api/lost/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    deleteLost: async (id: string) => {
        const response = await api.delete(`/api/lost/${id}`);
        return response.data;
    },

    getUserCollectedLosts: async (
        userId: string,
        params: {
            page?: number;
            limit?: number;
            column?: string;
            orderDirection?: "ASC" | "DESC";
        }
    ) => {
        const response = await api.get(`/api/lost/user/${userId}/collected`, { params });
        return response.data;
    },
}
export default lostsApi;