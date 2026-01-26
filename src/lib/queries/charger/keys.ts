// lib/queries/chargers/keys.ts
export const chargerKeys = {
  all: () => ["chargers"] as const,

  status: () => [...chargerKeys.all(), "status"] as const,

  statusList: (params: {
    page: number;
    limit: number;
    column: string;
    orderDirection: string;
  }) =>
    [
      ...chargerKeys.status(),
      params.page,
      params.limit,
      params.column,
      params.orderDirection,
    ] as const,

  detail: (chargerId: string) =>
    [...chargerKeys.all(), "detail", chargerId] as const,
};
