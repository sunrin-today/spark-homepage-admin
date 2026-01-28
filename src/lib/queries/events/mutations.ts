// src/lib/queries/events/mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import eventsApi from '@/lib/api/events';
import { eventKeys } from './keys';
import { Event, EventCreateForm, EventFormState } from '@/lib/types/events';
import { useRouter } from 'next/navigation';
import { buildEventCreatePayload, buildEventUpdatePayload } from '@/utils/events';
import { ImageItem } from '@/lib/types/common';

export function useCreateEvent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EventFormState) => 
        eventsApi.createEvent(buildEventCreatePayload(data)),
    onSuccess: () => {
      alert("이벤트가 생성되었습니다.");
      queryClient.invalidateQueries({ queryKey: ['events'] });
      router.push("/events");
    },
  });
}

export function useUpdateEvent(id: string, initialDetailImages: ImageItem[]) {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: EventFormState) =>
      eventsApi.updateEvent(
        id,
        buildEventUpdatePayload(data, initialDetailImages)
      ),

    onSuccess: (updated: Event) => {
      alert("이벤트가 수정되었습니다.");
      qc.setQueryData(eventKeys.detail(id), updated);
      qc.invalidateQueries({ queryKey: eventKeys.lists() });
      router.push("/events");
    },
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) =>
      eventsApi.deleteEvent(id),

    onSuccess: () => {
      alert("이벤트가 삭제되었습니다.");
      qc.invalidateQueries({ queryKey: eventKeys.lists() });
      router.push("/events");
    },
  });
}
