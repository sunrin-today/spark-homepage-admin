export type ScheduleType = "ACADEMIC";

export interface Schedule {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  color: string;
  type: ScheduleType;
  eventId: string | null;
}

export interface ScheduleCreateRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  color: string;
  type: ScheduleType;
  eventId?: string;
}

export interface ScheduleUpdateRequest {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  color?: string;
  type?: ScheduleType;
  eventId?: string;
}

export interface ScheduleListResponse {
  items: Schedule[];
  total: number;
  currentPage: number;
  totalPages: number;
}