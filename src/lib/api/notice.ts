import { Notice, NoticeListResponse, NoticeDetailResponse } from '@/lib/types/notice';
import api from './api';

// api 응답을 ui 타입으로 변환
const transformNoticeFromApi = (apiNotice: NoticeDetailResponse): Notice => {
  return {
    id: apiNotice.id,
    title: apiNotice.title,
    content: apiNotice.content,
    author: 'Admin', // api에 author 필드가 없어서 일단 기본값 설정
    createdAt: apiNotice.createdAt,
    updatedAt: apiNotice.updatedAt,
    viewCount: apiNotice.viewCount,
    views: apiNotice.viewCount,
    images: apiNotice.images,
    imageUrl: apiNotice.images,
  };
};

interface CreateNoticeData {
  title: string;
  content: string;
  images?: string[];
}

interface UpdateNoticeData {
  title?: string;
  content?: string;
  images?: string[];
}

export const noticesApi = {
  getNotices: async (): Promise<Notice[]> => {
    try {
      const response = await api.get<NoticeListResponse>('/api/notice');
      const data = response.data;
      
      // items 배열을 ui 타입으로 변환
      return data.items.map(transformNoticeFromApi);
    } catch (error) {
      console.error('Failed to fetch notices:', error);
      throw error;
    }
  },

  getNoticeById: async (id: string): Promise<Notice> => {
    try {
      const response = await api.get<NoticeDetailResponse>(`/api/notice/${id}`);
      return transformNoticeFromApi(response.data);
    } catch (error) {
      console.error('Failed to fetch notice:', error);
      throw error;
    }
  },

  createNotice: async (data: CreateNoticeData): Promise<Notice> => {
    try {
      const response = await api.post<NoticeDetailResponse>('/api/notice', data);
      return transformNoticeFromApi(response.data);
    } catch (error) {
      console.error('Failed to create notice:', error);
      throw error;
    }
  },

  updateNotice: async (id: string, data: UpdateNoticeData): Promise<Notice> => {
    try {
      const response = await api.patch<NoticeDetailResponse>(`/api/notice/${id}`, data);
      return transformNoticeFromApi(response.data);
    } catch (error) {
      console.error('Failed to update notice:', error);
      throw error;
    }
  },

  deleteNotice: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/notice/${id}`);
    } catch (error) {
      console.error('Failed to delete notice:', error);
      throw error;
    }
  },
};