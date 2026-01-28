export const chargerRequestKeys = {
  all: () => ['charger-requests'] as const,

  lists: () => [...chargerRequestKeys.all(), 'list'] as const,

  list: (params: {
    page: number;
    limit: number;
    column?: string;
    orderDirection?: string;
    // Add other filter parameters here as needed
  }) =>
    [
      ...chargerRequestKeys.lists(),
      params.page,
      params.limit,
      params.column ?? null,
      params.orderDirection ?? null,
    ] as const,

  detail: (requestId: string) =>
    [...chargerRequestKeys.all(), 'detail', requestId] as const,
};