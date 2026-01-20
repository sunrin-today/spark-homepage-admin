
export const meetingRoomKeys = {
  all: ['meeting-room'] as const,
  
  rentalRecords: () => [...meetingRoomKeys.all, 'rental-records'] as const,
  
  rentalRecord: (id: string) => [...meetingRoomKeys.all, 'rental-record', id] as const,
};