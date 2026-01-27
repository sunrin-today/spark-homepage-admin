import { useMutation, useQueryClient } from '@tanstack/react-query';
import scheduleApi from '@/lib/api/schedule';
import { scheduleKeys } from './keys';
import { ScheduleCreateRequest, ScheduleUpdateRequest } from '@/lib/types/schedule';

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ScheduleCreateRequest) => scheduleApi.createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
      alert('일정이 생성되었습니다.');
    },
    onError: (error) => {
      console.error('Failed to create schedule:', error);
      alert('일정 생성에 실패했습니다.');
    },
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ScheduleUpdateRequest }) =>
      scheduleApi.updateSchedule(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(id) });
      alert('일정이 수정되었습니다.');
    },
    onError: (error) => {
      console.error('Failed to update schedule:', error);
      alert('일정 수정에 실패했습니다.');
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => scheduleApi.deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
      alert('일정이 삭제되었습니다.');
    },
    onError: (error) => {
      console.error('Failed to delete schedule:', error);
      alert('일정 삭제에 실패했습니다.');
    },
  });
};