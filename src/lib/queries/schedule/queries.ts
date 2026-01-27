import { useQuery } from '@tanstack/react-query';
import scheduleApi from '@/lib/api/schedule';
import { scheduleKeys } from './keys';

export const useSchedulesByMonth = (year: string, month: string) => {
  return useQuery({
    queryKey: scheduleKeys.byMonth(year, month),
    queryFn: () => scheduleApi.getSchedulesByMonth(year, month),
  });
};

export const useSchedulesByDate = (date: string) => {
  return useQuery({
    queryKey: scheduleKeys.byDate(date),
    queryFn: () => scheduleApi.getSchedulesByDate(date),
    enabled: !!date,
  });
};

export const useOngoingSchedules = () => {
  return useQuery({
    queryKey: scheduleKeys.ongoing(),
    queryFn: () => scheduleApi.getOngoingSchedules(),
  });
};

export const useUpcomingSchedules = () => {
  return useQuery({
    queryKey: scheduleKeys.upcoming(),
    queryFn: () => scheduleApi.getUpcomingSchedules(),
  });
};

export const useEndedSchedules = () => {
  return useQuery({
    queryKey: scheduleKeys.ended(),
    queryFn: () => scheduleApi.getEndedSchedules(),
  });
};

export const useCalendarSchedules = (year: string, month: string) => {
  return useQuery({
    queryKey: scheduleKeys.calendar(year, month),
    queryFn: () => scheduleApi.getCalendarSchedules(year, month),
  });
};

export const useAllSchedules = () => {
  return useQuery({
    queryKey: scheduleKeys.lists(),
    queryFn: () => scheduleApi.getAllSchedules(),
  });
};

export const useScheduleById = (id: string) => {
  return useQuery({
    queryKey: scheduleKeys.detail(id),
    queryFn: () => scheduleApi.getScheduleById(id),
    enabled: !!id,
  });
};