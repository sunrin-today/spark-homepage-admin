export const usersKeys = {
  all: ["users"] as const,
  lists: () => [...usersKeys.all, "list"] as const,
  list: (filters: {
    page?: number;
    limit?: number;
    column?: string;
    orderDirection?: string;
    query?: string;
  }) => [...usersKeys.lists(), filters] as const,
  me: () => [...usersKeys.all, "me"] as const,
};