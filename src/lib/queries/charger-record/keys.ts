export const chargerRentalRecordKeys = {
  all: ['charger-rental-records'] as const,
  
  lists: () => [...chargerRentalRecordKeys.all, 'list'] as const,
  list: (params?: { page?: number; limit?: number; column?: string; orderDirection?: string }) =>
    params ? [...chargerRentalRecordKeys.lists(), params] : [...chargerRentalRecordKeys.lists()],
    
  byUser: (userId: string) => 
    [...chargerRentalRecordKeys.all, 'user', userId] as const,
    
  byCharger: (chargerId: string) =>
    [...chargerRentalRecordKeys.all, 'charger', chargerId] as const,
    
  detail: (recordId: string) =>
    [...chargerRentalRecordKeys.all, 'detail', recordId] as const,
};