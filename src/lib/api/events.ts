import EventFormData, { Event } from '@/lib/types/events';
import { ListResponse } from '@/lib/types/common';
import api from './api';

const eventsApi = {
    // 이벤트 목록 조회
    getEvents: async (page: number = 1, limit: number = 10, query?: string) => {
        const response = await api.get<ListResponse<Event>>('/api/event', {
            params: { page, limit, query },
        });
        return response.data;
    },

    // 이벤트 상세 조회
    getEventById: async (id: string) => {
        const response = await api.get<Event>(`/api/event/${id}`);
        return response.data;
    },

    createEvent: async (eventData: EventFormData) => {
        const formData = new FormData();

        formData.append('name', eventData.name);
        formData.append('description', eventData.description);
        formData.append('startedAt', eventData.startedAt);
        formData.append('deadline', eventData.deadline);
        formData.append('link', eventData.link);
        formData.append('isLinkOn', String(eventData.isLinkOn));

        if (eventData.thumbnail instanceof File) {
            formData.append('thumbnail', eventData.thumbnail);
        }

        if (eventData.detailImages?.length) {
            eventData.detailImages.forEach((file) => {
                if (file instanceof File) {
                    formData.append('detailImages', file);
                }
            });
        }

        const response = await api.post<Event>('/api/event', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
  
    // 이벤트 수정
    updateEvent: async (id: string, eventData: Partial<Event>) => {
        const response = await api.patch<Event>(`/api/event/${id}`, eventData);
        return response.data;
    },
  
    // 이벤트 삭제
    deleteEvent: async (id: string) => {
        await api.delete(`/api/event/${id}`);
    },
};

export default eventsApi;
