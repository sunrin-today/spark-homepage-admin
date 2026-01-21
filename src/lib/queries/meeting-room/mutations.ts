// meeting-room/mutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import meetingRoomApi from '@/lib/api/meeting-room';
import { meetingRoomKeys } from './keys';

export const useApproveRentalMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => meetingRoomApi.approveRental(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: meetingRoomKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: meetingRoomKeys.detail(id),
      });
      alert("대여 신청이 승인되었습니다.");
    },
  });
};

export const useRejectRentalMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => meetingRoomApi.rejectRental(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: meetingRoomKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: meetingRoomKeys.detail(id),
      });
      alert("대여 신청이 거절되었습니다.");
    },
  });
};

export const useDeleteRentalMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => meetingRoomApi.deleteRentalRecord(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: meetingRoomKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: meetingRoomKeys.detail(id),
      });
      alert("대여 기록이 삭제되었습니다.");
    },
  });
};
