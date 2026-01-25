import { useMutation, useQueryClient } from '@tanstack/react-query';
import { noticesApi } from '@/lib/api/notice';

interface UpdateNoticeParams {
  title: string;
  content: string;
  deletes?: string[];
  newImages?: string[];
  exists: Array<{ url: string; index: number }>;
  imageIndexes?: number[];
}

export const useUpdateNotice = (id: string, originalImages: string[]) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateNoticeParams) => noticesApi.updateNotice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notice', id] });
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
  });
};