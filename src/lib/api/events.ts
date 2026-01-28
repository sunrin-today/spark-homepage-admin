import { Event, EventCreateForm, EventUpdateForm } from '@/lib/types/events';
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

    createEvent: async (eventData: EventCreateForm) => {
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
        console.log("EventData" , eventData)
        const response = await api.post<Event>('/api/event', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
  
    // 이벤트 수정
    updateEvent: async (id: string, eventData: EventUpdateForm) => {
        const formData = new FormData();

        formData.append('name', eventData.name);
        formData.append('description', eventData.description);
        formData.append('startedAt', eventData.startedAt);
        formData.append('deadline', eventData.deadline);
        formData.append('link', eventData.link);
        formData.append('isLinkOn', String(eventData.isLinkOn));

        if (eventData.thumbnail !== null) {
            formData.append('thumbnail', eventData.thumbnail);
        }
        else {
            formData.append('thumbnail', "null");
        }
        formData.append("exists", JSON.stringify(eventData.exists));
        formData.append('imageIndexes', JSON.stringify(eventData.imageIndexes));
        formData.append('deletes', JSON.stringify(eventData.deletes));

        if (eventData.newImages?.length) {
            eventData.newImages.forEach((file) => {
                if (file instanceof File) {
                    formData.append('newImages', file);
                }
            });
        }
        console.log("FormData", formData);
        const response = await api.put<Event>(`/api/event/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
  
    // 이벤트 삭제
    deleteEvent: async (id: string) => {
        await api.delete(`/api/event/${id}`);
    },
};

export default eventsApi;
