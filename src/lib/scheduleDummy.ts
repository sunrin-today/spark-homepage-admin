export interface Schedule {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  color: string;
  description: string;
}

export const scheduleDummyData: Schedule[] = [
  {
    id: '1',
    title: '2026 신입생 도우미 모집안내',
    startDate: '2026-01-06',
    endDate: '2026-01-06',
    color: '#FCD34D',
    description: '2026년 신입생 도우미를 모집합니다.',
  },
  {
    id: '2',
    title: '2026 신입생 도우미 모집안내',
    startDate: '2026-01-06',
    endDate: '2026-01-06',
    color: '#FCD34D',
    description: '2026년 신입생 도우미를 모집합니다.',
  },
  {
    id: '3',
    title: '2026 신입생 도우미 모집안내',
    startDate: '2026-01-06',
    endDate: '2026-01-06',
    color: '#FCD34D',
    description: '2026년 신입생 도우미를 모집합니다.',
  },
  {
    id: '4',
    title: '2026 신입생 도우미 모집안내',
    startDate: '2026-01-08',
    endDate: '2026-01-08',
    color: '#FCD34D',
    description: '2026년 신입생 도우미를 모집합니다.',
  },
  {
    id: '5',
    title: '2026 신입생 도우미 모집안내',
    startDate: '2026-01-08',
    endDate: '2026-01-08',
    color: '#FCD34D',
    description: '2026년 신입생 도우미를 모집합니다.',
  },
  {
    id: '6',
    title: '2026 신입생 도우미 모집안내',
    startDate: '2026-01-08',
    endDate: '2026-01-08',
    color: '#FCD34D',
    description: '2026년 신입생 도우미를 모집합니다.',
  },
  {
    id: '7',
    title: '중간 일정',
    startDate: '2026-01-05',
    endDate: '2026-01-08',
    color: '#FCA5A5',
    description: '1월 5일부터 8일까지 진행되는 일정',
  },
  {
    id: '8',
    title: '다른 일정',
    startDate: '2026-01-07',
    endDate: '2026-01-09',
    color: '#86EFAC',
    description: '1월 7일부터 9일까지 진행되는 일정',
  },
];

// 특정 월의 일정 가져오기
export const getSchedulesByMonth = (year: number, month: number): Schedule[] => {
  return scheduleDummyData.filter((schedule) => {
    const startDate = new Date(schedule.startDate);
    const endDate = new Date(schedule.endDate);
    const targetMonth = new Date(year, month - 1);
    
    return (
      (startDate.getFullYear() === year && startDate.getMonth() === month - 1) ||
      (endDate.getFullYear() === year && endDate.getMonth() === month - 1) ||
      (startDate <= targetMonth && endDate >= targetMonth)
    );
  });
};

// 특정 날짜의 일정 가져오기
export const getSchedulesByDate = (date: string): Schedule[] => {
  const targetDate = new Date(date);
  
  return scheduleDummyData.filter((schedule) => {
    const startDate = new Date(schedule.startDate);
    const endDate = new Date(schedule.endDate);
    
    return targetDate >= startDate && targetDate <= endDate;
  });
};