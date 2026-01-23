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
    color: '#FFE284',
    description: '2026년 신입생 도우미를 모집합니다.',
  },
  {
    id: '2',
    title: '2026 신입생 도우미 모집안내',
    startDate: '2026-02-06',
    endDate: '2026-02-06',
    color: '#FFE284',
    description: '2026년 신입생 도우미를 모집합니다.',
  },
  {
    id: '3',
    title: '2026 신입생 도우미 모집안내',
    startDate: '2026-02-16',
    endDate: '2026-02-17',
    color: '#FFE284',
    description: '2026년 신입생 도우미를 모집합니다.',
  },
  {
    id: '4',
    title: '2026 신입생 도우미 모집안내',
    startDate: '2026-01-08',
    endDate: '2026-01-08',
    color: '#FFE284',
    description: '2026년 신입생 도우미를 모집합니다.',
  },
  {
    id: '5',
    title: '2026 신입생 도우미 모집안내',
    startDate: '2026-03-01',
    endDate: '2026-03-08',
    color: '#FFE284',
    description: '2026년 신입생 도우미를 모집합니다.',
  },
  {
    id: '6',
    title: '2026 신입생 도우미 모집안내',
    startDate: '2026-04-08',
    endDate: '2026-04-08',
    color: '#FFE284',
    description: '2026년 신입생 도우미를 모집합니다.',
  },
  {
    id: '7',
    title: '중간 일정',
    startDate: '2026-01-11',
    endDate: '2026-01-18',
    color: '#FF1212',
    description: '1월 11일부터 18일까지 진행되는 일정',
  },
  {
    id: '8',
    title: '다른 일정',
    startDate: '2026-02-18',
    endDate: '2026-02-28',
    color: '#00FF08',
    description: '2월 18일부터 28일까지 진행되는 일정',
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