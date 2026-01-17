import React, { useState } from 'react';

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  highlightedDates?: Date[];
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  highlightedDates = [],
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 달의 첫날과 마지막날 구하기
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // 달력에 표시할 시작일 (이전 달의 날짜 포함)
  const startDay = firstDayOfMonth.getDay(); // 0 (일요일) ~ 6 (토요일)
  const endDay = lastDayOfMonth.getDay(); // 0 (일요일) ~ 6 (토요일)
  const daysInMonth = lastDayOfMonth.getDate();

  // 이전 달 마지막 날
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  // 달력 날짜 배열 생성
  const calendarDays: Date[] = [];

  // 이전 달 날짜 (일요일부터 시작하지 않는 경우만)
  for (let i = startDay - 1; i >= 0; i--) {
    calendarDays.push(new Date(year, month - 1, prevMonthLastDay - i));
  }

  // 이번 달 날짜
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(year, month, i));
  }

  // 다음 달 날짜 (토요일로 끝나지 않는 경우만)
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
    if (onDateSelect) {
      onDateSelect(date);
    }
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

  return (
    <div className="w-full bg-white rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold">{year}년</span>
          <span className="text-lg font-semibold">
            {String(month + 1).padStart(2, '0')}월
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm py-2 ${
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

      <div className="border-t border-gray-200 mb-2"></div>

      <div className="grid grid-cols-7">
        {calendarDays.map((date, index) => {
          const dayOfWeek = date.getDay();
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              className={`
                aspect-square flex items-center justify-center text-sm
                relative
                ${getDateColor(date, dayOfWeek)}
                ${isSelected ? 'bg-black text-white rounded-lg' : ''}
                ${!isSelected && isToday ? 'font-bold' : ''}
                hover:bg-gray-100 transition-colors
                ${isSelected ? 'hover:bg-black' : ''}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;