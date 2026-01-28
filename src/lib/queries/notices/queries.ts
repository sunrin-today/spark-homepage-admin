import { useQuery } from '@tanstack/react-query';
import { noticesApi } from '@/lib/api/notice';
import { noticeKeys } from './keys';

export const useNotice = (id: string) => {
  return useQuery({
    queryKey: noticeKeys.detail(id),
    queryFn: () => noticesApi.getNoticeById(id),
    enabled: !!id,
  });
};

export const useNotices = () => {
  return useQuery({
    queryKey: noticeKeys.lists(),
    queryFn: () => noticesApi.getNotices(),
  });
};