import { useQuery } from '@tanstack/react-query';
import { noticesApi } from '@/lib/api/notice';

export const useNotice = (id: string) => {
  return useQuery({
    queryKey: ['notice', id],
    queryFn: () => noticesApi.getNoticeById(id),
    enabled: !!id,
  });
};

export const useNotices = () => {
  return useQuery({
    queryKey: ['notices'],
    queryFn: () => noticesApi.getNotices(),
  });
};