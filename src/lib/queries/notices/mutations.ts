import { useMutation, useQueryClient } from '@tanstack/react-query';
import { noticesApi } from '@/lib/api/notice';
import { noticeKeys } from './keys';
import { useRouter } from 'next/navigation';

interface CreateNoticeData {
  title: string;
  content: string;
  imageFiles?: File[];
}

interface UpdateNoticeParams {
  title: string;
  content: string;
  deletes?: string[];
  newImages?: File[]; 
  exists: Array<{ url: string; index: number }>;
  imageIndexes?: number[];
}

export const useCreateNotice = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateNoticeData) => noticesApi.createNotice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
      alert('공지사항이 등록되었습니다.');
      router.push('/notice');
    },
    onError: (error: any) => {
      console.error('Failed to create notice:', error);
      alert('공지사항 등록에 실패했습니다.');
    },
  });
};

export const useUpdateNotice = (id: string, originalImages: string[]) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: UpdateNoticeParams) => noticesApi.updateNotice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
      alert('공지사항이 수정되었습니다.');
      router.push(`/notice/${id}`);
    },
    onError: (error: any) => {
      console.error('Failed to update notice:', error);
      alert('공지사항 수정에 실패했습니다.');
    },
  });
};

export const useDeleteNotice = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => noticesApi.deleteNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
      alert('공지사항이 삭제되었습니다.');
      router.push('/notice');
    },
    onError: (error: any) => {
      console.error('Failed to delete notice:', error);
      alert('공지사항 삭제에 실패했습니다.');
    },
  });
};