import api from './api';
import { Schedule, ScheduleCreateRequest, ScheduleUpdateRequest } from '../types/schedule';

const scheduleApi = {
  // 월 단위 스케줄 조회
  getSchedulesByMonth: async (year: string, month: string) => {
    const response = await api.get<Schedule[]>('/api/schedule/month', {
      params: { year, month },
    });
    return response.data;
  },

  // 특정 날짜 스케줄 조회
  getSchedulesByDate: async (date: string) => {
    const response = await api.get<Schedule[]>('/api/schedule/date', {
      params: { date },
    });
    return response.data;
  },

  // 진행 중인 스케줄 조회
  getOngoingSchedules: async () => {
    const response = await api.get<Schedule[]>('/api/schedule/status/ongoing');
    return response.data;
  },

  // 진행 예정 스케줄 조회
  getUpcomingSchedules: async () => {
    const response = await api.get<Schedule[]>('/api/schedule/status/upcoming');
    return response.data;
  },

  // 종료된 스케줄 조회
  getEndedSchedules: async () => {
    const response = await api.get<Schedule[]>('/api/schedule/status/ended');
    return response.data;
  },

  // 캘린더용 스케줄 조회 (DB + 학사일정)
  getCalendarSchedules: async (year: string, month: string) => {
    const response = await api.get<Schedule[]>('/api/schedule/calendar', {
      params: { year, month },
    });
    return response.data;
  },

  // 전체 스케줄 조회
  getAllSchedules: async () => {
    const response = await api.get<Schedule[]>('/api/schedule');
    return response.data;
  },

  // ID로 스케줄 조회
  getScheduleById: async (id: string) => {
    const response = await api.get<Schedule>(`/api/schedule/${id}`);
    return response.data;
  },

  // 스케줄 생성
  createSchedule: async (data: ScheduleCreateRequest) => {
    const response = await api.post<Schedule>('/api/schedule', data);
    return response.data;
  },

  // 스케줄 수정
  updateSchedule: async (id: string, data: ScheduleUpdateRequest) => {
    const response = await api.patch<Schedule>(`/api/schedule/${id}`, data);
    return response.data;
  },

  // 스케줄 삭제
  deleteSchedule: async (id: string) => {
    await api.delete(`/api/schedule/${id}`);
  },
};

export default scheduleApi;