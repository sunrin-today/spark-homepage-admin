// src/lib/queries/events/queries.ts
import { useQuery } from '@tanstack/react-query';
import eventsApi from '@/lib/api/events';
import { eventKeys } from './keys';

export function useEvents(params: {
  page: number;
  limit: number;
  search?: string;
}) {
  const { page, limit, search } = params;

  return useQuery({
    queryKey: eventKeys.list({ page, limit, search }),
    queryFn: () => eventsApi.getEvents(page, limit, search),
    staleTime: 5 * 60 * 1000,
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsApi.getEventById(id),
    enabled: !!id,
  });
}
