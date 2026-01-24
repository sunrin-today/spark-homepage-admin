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
  imageFiles?: File[]; // File 객체 배열로 변경
}

interface UpdateNoticeData {
  title: string;
  content: string;
  deletes?: string[]; // 삭제할 이미지 URL
  newImages?: string[]; // 새 이미지 (base64)
  exists: Array<{ url: string; index: number }>; // 기존 이미지들의 위치 정보
  imageIndexes?: number[]; // 새 이미지 index
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
      
      // FormData 생성
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      
      // imageFiles가 있으면 File 객체를 직접 추가
      if (data.imageFiles && data.imageFiles.length > 0) {
        data.imageFiles.forEach((file, index) => {
          formData.append('images', file, file.name);
          console.log(`Added image ${index}:`, file.name, file.size, 'bytes');
        });
      }
      
      console.log('Sending FormData to server');
      
      const response = await api.post<NoticeDetailResponse>(
        '/api/notice', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
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
      console.log('Updating notice with data:', data);
      
      // FormData 생성
      const formData = new FormData();
      
      formData.append('title', data.title);
      formData.append('content', data.content);
      
      // exists는 JSON 문자열로 변환
      formData.append('exists', JSON.stringify(data.exists));
      
      // deletes 배열을 JSON 문자열로 변환
      if (data.deletes && data.deletes.length > 0) {
        formData.append('deletes', JSON.stringify(data.deletes));
        console.log('Added deletes:', data.deletes);
      } else {
        formData.append('deletes', JSON.stringify([]));
      }
      
      // newImages는 base64 문자열 배열로 전송
      if (data.newImages && data.newImages.length > 0) {
        formData.append('newImages', JSON.stringify(data.newImages));
        console.log('Added newImages count:', data.newImages.length);
      } else {
        formData.append('newImages', JSON.stringify([]));
      }
      
      // imageIndexes도 JSON 문자열로 변환
      if (data.imageIndexes && data.imageIndexes.length > 0) {
        formData.append('imageIndexes', JSON.stringify(data.imageIndexes));
      } else {
        formData.append('imageIndexes', JSON.stringify([]));
      }
      
      // FormData 내용 확인
      console.log('=== FormData Contents ===');
      for (const pair of formData.entries()) {
        console.log(pair[0] + ':', typeof pair[1] === 'string' ? pair[1] : '[File]');
      }
      
      console.log('Sending update FormData to server');
      
      const response = await api.put<NoticeDetailResponse>(
        `/api/notice/${id}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('Notice updated successfully:', response.data);
      return transformNoticeFromApi(response.data);
    } catch (error) {
      console.error('Failed to update notice:', error);
      
      if (error instanceof AxiosError) {
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
      }
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