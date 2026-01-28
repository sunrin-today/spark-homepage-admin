export const scheduleKeys = {
  all: ['schedules'] as const,

  lists: () => [...scheduleKeys.all, 'list'] as const,

  byMonth: (year: string, month: string) =>
    [...scheduleKeys.all, 'month', year, month] as const,

  byDate: (date: string) =>
    [...scheduleKeys.all, 'date', date] as const,

  ongoing: () =>
    [...scheduleKeys.all, 'ongoing'] as const,

  upcoming: () =>
    [...scheduleKeys.all, 'upcoming'] as const,

  ended: () =>
    [...scheduleKeys.all, 'ended'] as const,

  calendar: (year: string, month: string) =>
    [...scheduleKeys.all, 'calendar', year, month] as const,

  detail: (id: string) =>
    [...scheduleKeys.all, 'detail', id] as const,
};