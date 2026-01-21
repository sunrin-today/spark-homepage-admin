import api from './api';
import { ListResponse } from '../types/common';
import { Lost, LostCreateRequest, LostUpdateRequest } from '../types/losts';

const lostsApi = {
    getLosts: async (page: number = 1, limit: number = 10, query?: string) => {
        const response = await api<ListResponse<Lost>>('/api/lost', {
            params: { page, limit, query },
        });
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
        formData.append("foundDate", lostData.foundDate);

        if (lostData.thumbnail) {
            formData.append("thumbnail", lostData.thumbnail);
        }
        if (lostData.detailImages) {
            lostData.detailImages.forEach((file) => {
                formData.append("detailImages", file);
            });
        }
        const response = await api.post('/api/lost', formData);
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
        const response = await api.put(`/api/lost/${id}`, formData);
        return response.data;
    },
    deleteLost: async (id: string) => {
        const response = await api.delete(`/api/lost/${id}`);
        return response.data;
    },
}
export default lostsApi;