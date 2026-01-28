export const lostKeys = {
  all: ["losts"] as const,

  lists: () => [...lostKeys.all, "list"] as const,
  list: (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: "FOUND" | "COLLECTED";
  }) =>
    [...lostKeys.lists(), params] as const,

  details: () => [...lostKeys.all, "detail"] as const,
  detail: (id: string) =>
    [...lostKeys.details(), id] as const,
};
