import { Notice, NoticeListResponse, NoticeDetailResponse } from '@/lib/types/notice';
import api from './api';
import { AxiosError } from 'axios';

// api 응답을 ui 타입으로 변환
const transformNoticeFromApi = (apiNotice: NoticeDetailResponse): Notice => {
  return {
    id: apiNotice.id,
    title: apiNotice.title,
    content: apiNotice.content,
    author: apiNotice.author,
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
      const formData = new FormData();

      // 1. 기본 필드 추가
      formData.append('title', data.title);
      formData.append('content', data.content);

      // 2. 메타데이터 배열 처리 
      formData.append('exists', JSON.stringify(data.exists));
      formData.append('deletes', JSON.stringify(data.deletes || []));
      formData.append('imageIndexes', JSON.stringify(data.imageIndexes || []));

      // 3. 새 이미지 파일 처리 (File 객체 그대로 전송)
      if (data.newImages && data.newImages.length > 0) {
        data.newImages.forEach((file: any) => {
          if (file instanceof File) {
            formData.append('newImages', file);
          }
        });
      }

      const response = await api.put<NoticeDetailResponse>(
        `/api/notice/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return transformNoticeFromApi(response.data);
    } catch (error) {
      console.error('=== API Error ===', error);
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