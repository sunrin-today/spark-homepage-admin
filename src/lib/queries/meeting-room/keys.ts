export const meetingRoomKeys = {
  all: ['meeting-room'] as const,

  lists: () => [...meetingRoomKeys.all, 'list'] as const,
  list: (params: {
    page: number;
    limit: number;
    column: string;
    orderDirection: string;
  }) =>
    [...meetingRoomKeys.lists(), params] as const,

  details: () => [...meetingRoomKeys.all, 'detail'] as const,
  detail: (id: string) =>
    [...meetingRoomKeys.details(), id] as const,
};
