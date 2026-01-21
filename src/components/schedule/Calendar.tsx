import React, { useState } from 'react';

interface Schedule {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  color: string;
  description: string;
}

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  highlightedDates?: Date[];
  schedules?: Schedule[];
  onScheduleClick?: (schedules: Schedule[], position: { top: number; left: number }) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  highlightedDates = [],
  schedules = [],
  onScheduleClick,
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

  for (let i = startDay - 1; i >= 0; i--) {
    calendarDays.push(new Date(year, month - 1, prevMonthLastDay - i));
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(year, month, i));
  }

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

  const getScheduleRanges = () => {
    const ranges: { schedule: Schedule; startCol: number; endCol: number; row: number }[] = [];
    
    schedules.forEach(schedule => {
      const startDate = new Date(schedule.startDate);
      const endDate = new Date(schedule.endDate);
      
      calendarDays.forEach((day, index) => {
        const row = Math.floor(index / 7);
        const col = index % 7;
        
        if (day >= startDate && day <= endDate) {
          const existingRange = ranges.find(
            r => r.schedule.id === schedule.id && r.row === row
          );
          
          if (existingRange) {
            existingRange.endCol = col;
          } else {
            ranges.push({
              schedule,
              startCol: col,
              endCol: col,
              row
            });
          }
        }
      });
    });
    
    return ranges;
  };

  const scheduleRanges = getScheduleRanges();

  const handleScheduleClick = (e: React.MouseEvent, clickedSchedule: Schedule) => {
    e.stopPropagation();
    if (onScheduleClick) {
      // 클릭한 일정과 겹치는 모든 일정을 찾음
      const clickedDate = new Date(clickedSchedule.startDate);
      const overlappingSchedules = schedules.filter(s => {
        const start = new Date(s.startDate);
        const end = new Date(s.endDate);
        return clickedDate >= start && clickedDate <= end;
      });
      
      const rect = e.currentTarget.getBoundingClientRect();
      onScheduleClick(overlappingSchedules, {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
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
            type="button"
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
            type="button"
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

      <div className="relative">
        <div className="grid grid-cols-7">
          {calendarDays.map((date, index) => {
            const dayOfWeek = date.getDay();
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());

            return (
              <button
                type="button"
                key={index}
                onClick={() => handleDateClick(date)}
                className={`
                  aspect-square flex items-center justify-center text-sm
                  relative
                  ${getDateColor(date, dayOfWeek)}
                  ${isToday ? 'font-bold' : ''}
                  hover:bg-gray-100 transition-colors
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        {/* 일정 띠 렌더링 */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: '100%' }}>
          {scheduleRanges.map((range, idx) => {
            const cellWidth = 100 / 7;
            const cellHeight = 100 / Math.ceil(calendarDays.length / 7);
            
            const width = (range.endCol - range.startCol + 1) * cellWidth;
            const left = range.startCol * cellWidth;
            const top = range.row * cellHeight;
            
            const isStart = range.startCol === 0 || 
              !scheduleRanges.some(r => 
                r.schedule.id === range.schedule.id && 
                r.row === range.row && 
                r.endCol === range.startCol - 1
              );
            
            const isEnd = range.endCol === 6 || 
              !scheduleRanges.some(r => 
                r.schedule.id === range.schedule.id && 
                r.row === range.row && 
                r.startCol === range.endCol + 1
              );

            return (
              <div
                key={`${range.schedule.id}-${idx}`}
                onClick={(e) => handleScheduleClick(e, range.schedule)}
                className="absolute pointer-events-auto cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  left: `${left}%`,
                  top: `calc(${top}% + 50%)`,
                  width: `${width}%`,
                  height: `${cellHeight * 0.4}%`,
                  backgroundColor: range.schedule.color,
                  opacity: 0.7,
                  borderRadius: isStart && isEnd ? '999px' : 
                               isStart ? '999px 0 0 999px' : 
                               isEnd ? '0 999px 999px 0' : '0',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;