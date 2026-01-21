// meeting-room/queries.ts
import { useQuery } from '@tanstack/react-query';
import meetingRoomApi from '@/lib/api/meeting-room';
import { meetingRoomKeys } from './keys';

export const useMeetingRoomListQuery = (params: {
  page: number;
  limit: number;
  column: string;
  orderDirection: string;
}) => {
  return useQuery({
    queryKey: meetingRoomKeys.list(params),
    queryFn: () =>
      meetingRoomApi.getRentalRecords(
        params.page,
        params.limit,
        params.column,
        params.orderDirection
      ),
    placeholderData: (previousData) => previousData
  });
};

export const useMeetingRoomDetailQuery = (id: string) => {
  return useQuery({
    queryKey: meetingRoomKeys.detail(id),
    queryFn: () => meetingRoomApi.getRentalRecord(id),
    enabled: !!id, // id 없을 때 실행 방지
  });
};
