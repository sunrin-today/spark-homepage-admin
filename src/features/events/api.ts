import { useQuery } from '@tanstack/react-query';
import eventsApi from '@/lib/api/events';
import { Event } from '@/lib/types/events';

export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: { search?: string } = {}) => 
    [...eventKeys.lists(), { ...filters }] as const,
  detail: (id: string) => [...eventKeys.all, id] as const,
};

export function useEvents(search?: string) {
  return useQuery({
    queryKey: eventKeys.list({ search }),
    queryFn: () => eventsApi.getEvents(1, 10, search).then(res => res.items),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsApi.getEventById(id),
    enabled: !!id,
  });
}
