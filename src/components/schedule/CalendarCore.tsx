import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarCoreProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  children?: (renderProps: CalendarRenderProps) => React.ReactNode;
  className?: string;
}

export interface CalendarRenderProps {
  calendarDays: Date[];
  year: number;
  month: number;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleDateClick: (date: Date) => void;
  isSameDay: (date1: Date, date2: Date) => boolean;
  isCurrentMonth: (date: Date) => boolean;
  getDateColor: (date: Date, dayOfWeek: number) => string;
  weekDays: string[];
}

const CalendarCore: React.FC<CalendarCoreProps> = ({
  selectedDate,
  onDateSelect,
  children,
  className = "w-full bg-white rounded-lg p-4",
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDay = firstDayOfMonth.getDay();
  const endDay = lastDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const calendarDays: Date[] = [];

  // 이전 달 날짜
  for (let i = startDay - 1; i >= 0; i--) {
    calendarDays.push(new Date(year, month - 1, prevMonthLastDay - i));
  }

  // 현재 달 날짜
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(year, month, i));
  }

  // 다음 달 날짜
  if (endDay !== 6) {
    for (let i = 1; i <= 6 - endDay; i++) {
      calendarDays.push(new Date(year, month + 1, i));
    }
  }

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const handleDateClick = (date: Date) => {
    onDateSelect?.(date);
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  const getDateColor = (date: Date, dayOfWeek: number) => {
    const baseColor = dayOfWeek === 0 
        ? 'text-sunday' 
        : dayOfWeek === 6 
        ? 'text-saturday' 
        : 'text-black';

    if (!isCurrentMonth(date)) {
      return `${baseColor} opacity-40`;
    }

    return baseColor;
  };

  const renderProps: CalendarRenderProps = {
    calendarDays,
    year,
    month,
    handlePrevMonth,
    handleNextMonth,
    handleDateClick,
    isSameDay,
    isCurrentMonth,
    getDateColor,
    weekDays,
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xl font-medium ml-3">{year}년</span>
          <span className="text-xl font-medium">
            {String(month + 1).padStart(2, '0')}월
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 요일 */}
      <div className="grid grid-cols-7 mb-0">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center text-base font-medium py-3 ${
              index === 0
                ? 'text-sunday'
                : index === 6
                ? 'text-saturday'
                : 'text-black'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="border-t border-[#EBEBEB]" />

      {/* 자식 컴포넌트에게 렌더링 위임 */}
      {children?.(renderProps)}
    </div>
  );
};

export default CalendarCore;