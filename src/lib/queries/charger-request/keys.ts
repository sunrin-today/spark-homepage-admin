export const chargerRequestKeys = {
  all: ['charger-requests'] as const,

  lists: () => [...chargerRequestKeys.all, 'list'] as const,
  
  list: () => 
    [...chargerRequestKeys.lists()] as const,
    
  detail: (requestId: string) =>
    [...chargerRequestKeys.all, 'detail', requestId] as const,
};