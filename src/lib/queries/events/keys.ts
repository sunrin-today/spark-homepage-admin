export const eventKeys = {
  all: ['events'] as const,

  lists: () => [...eventKeys.all, 'list'] as const,

  list: (params: {
    page: number;
    limit: number;
    search?: string;
  }) =>
    [...eventKeys.lists(), params] as const,

  detail: (id: string) =>
    [...eventKeys.all, 'detail', id] as const,
};
