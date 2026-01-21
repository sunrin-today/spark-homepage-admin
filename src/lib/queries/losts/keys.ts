export const lostKeys = {
  all: ["losts"] as const,

  lists: () => [...lostKeys.all, "list"] as const,
  list: (params: Record<string, any>) =>
    [...lostKeys.lists(), params] as const,

  details: () => [...lostKeys.all, "detail"] as const,
  detail: (id: string) =>
    [...lostKeys.details(), id] as const,
};