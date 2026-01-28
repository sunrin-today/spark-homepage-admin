export const lostClaimsKeys = {
  all: () => ["lost-claims"] as const,

  lists: () => [...lostClaimsKeys.all(), "list"] as const,

  list: (params: {
    lostId?: string;
    page: number;
    limit: number;
    column: string;
    orderDirection: string;
  }) =>
    [
      ...lostClaimsKeys.lists(),
      params.lostId ?? null,
      params.page,
      params.limit,
      params.column,
      params.orderDirection,
    ] as const,

  my: () => [...lostClaimsKeys.all(), "my"] as const,
};
