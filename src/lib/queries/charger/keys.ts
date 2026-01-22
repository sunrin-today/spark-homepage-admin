// lib/queries/chargers/keys.ts
export const chargerKeys = {
  all: () => ["chargers"] as const,

  rentalRequests: () => [...chargerKeys.all(), "rental-requests"] as const,
  rentalRequestsList: (params: {
    page: number;
    limit: number;
    column: string;
    orderDirection: string;
  }) =>
    [
      ...chargerKeys.rentalRequests(),
      params.page,
      params.limit,
      params.column,
      params.orderDirection,
    ] as const,

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
};
