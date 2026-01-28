export const noticeKeys = {
  all: ['notices'] as const,
  
  lists: () => [...noticeKeys.all, 'list'] as const,
  
  detail: (id: string) => [...noticeKeys.all, 'detail', id] as const,
};