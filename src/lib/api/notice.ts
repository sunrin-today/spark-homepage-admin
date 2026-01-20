import { Notice, NoticeListResponse, NoticeDetailResponse } from '@/lib/types/notice';
import api from './api';
import { AxiosError } from 'axios';

// api 응답을 ui 타입으로 변환
const transformNoticeFromApi = (apiNotice: NoticeDetailResponse): Notice => {
  return {
    id: apiNotice.id,
    title: apiNotice.title,
    content: apiNotice.content,
    author: apiNotice.author?.name || 'Admin',
    createdAt: apiNotice.createdAt,
    updatedAt: apiNotice.updatedAt,
    viewCount: apiNotice.viewCount,
    views: apiNotice.viewCount,
    images: apiNotice.images,
    // api의 images 객체 배열을 url 문자열 배열로 변환
    imageUrls: apiNotice.images?.map(img => img.url) || [],
  };
};

interface CreateNoticeData {
  title: string;
  content: string;
  images?: string[]; // 요청 시에는 string 배열 (base64 or url)
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
      console.log('Creating notice with data:', data);
      
      const response = await api.post<NoticeDetailResponse>('/api/notice', data);
      
      console.log('Notice created successfully:', response.data);
      return transformNoticeFromApi(response.data);
    } catch (error) {
      console.error('Failed to create notice:', error);
      
      if (error instanceof AxiosError) {
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
      }
      throw error;
    }
  },

  updateNotice: async (id: string, data: UpdateNoticeData): Promise<Notice> => {
    try {
      const response = await api.patch<NoticeDetailResponse>(`/notice/${id}`, data);
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