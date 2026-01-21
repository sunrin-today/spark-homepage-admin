import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  inputDate?: Date | string; 
  onDateSelect?: (date: Date) => void;
  highlightedDates?: Date[];
  schedules?: Schedule[];
  onScheduleClick?: (
    schedules: Schedule[],
    position: { top: number; left: number }
  ) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  inputDate,
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

  const parsedInputDate = inputDate
    ? inputDate instanceof Date
      ? inputDate
      : new Date(inputDate)
    : null;

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
    onDateSelect?.(date);
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const normalizeDate = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

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

  /** 일정 범위 계산 */
  const getScheduleRanges = () => {
    const ranges: {
      schedule: Schedule;
      startCol: number;
      endCol: number;
      row: number;
    }[] = [];

    schedules.forEach((schedule) => {
      const startDate = normalizeDate(new Date(schedule.startDate));
      const endDate = normalizeDate(new Date(schedule.endDate));

      calendarDays.forEach((day, index) => {
        const currentDay = normalizeDate(day);
        const row = Math.floor(index / 7);
        const col = index % 7;

        if (currentDay >= startDate && currentDay <= endDate) {
          const existingRange = ranges.find(
            (r) => r.schedule.id === schedule.id && r.row === row
          );

          if (existingRange) {
            existingRange.endCol = col;
          } else {
            ranges.push({
              schedule,
              startCol: col,
              endCol: col,
              row,
            });
          }
        }
      });
    });

    return ranges;
  };

  const scheduleRanges = getScheduleRanges();

  const handleScheduleClick = (
    e: React.MouseEvent,
    clickedSchedule: Schedule
  ) => {
    e.stopPropagation();

    if (onScheduleClick) {
      const clickedDate = new Date(clickedSchedule.startDate);

      const overlappingSchedules = schedules.filter((s) => {
        const start = new Date(s.startDate);
        const end = new Date(s.endDate);
        return clickedDate >= start && clickedDate <= end;
      });

      const rect = e.currentTarget.getBoundingClientRect();
      onScheduleClick(overlappingSchedules, {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  };

  return (
    <div className="w-full bg-white rounded-lg p-4">
      {/* 헤더 */}
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
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 요일 */}
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

      <div className="border-t border-gray-200 mb-2" />

      {/* 날짜 */}
      <div className="relative">
        <div className="grid grid-cols-7">
          {calendarDays.map((date, index) => {
            const dayOfWeek = date.getDay();
            const isInputDate =
              parsedInputDate && isSameDay(date, parsedInputDate);

            return (
              <button
                key={index}
                type="button"
                onClick={() => handleDateClick(date)}
                className={`
                  aspect-square flex items-center justify-center text-base
                  relative
                  ${getDateColor(date, dayOfWeek)}
                  hover:bg-gray-100 transition-colors
                `}
              >
                {/* 인풋 검정 박스 */}
                {isInputDate && (
                  <span className="absolute inset-1 rounded-lg bg-black" />
                )}

                <span
                  className={`relative z-10 ${
                    isInputDate ? 'text-white font-medium' : ''
                  }`}
                >
                  {date.getDate()}
                </span>
              </button>
            );
          })}
        </div>

        {/* 일정 띠 */}
        <div className="absolute inset-0 pointer-events-none">
          {scheduleRanges.map((range, idx) => {
            const rows = Math.ceil(calendarDays.length / 7);
            const cellWidth = 100 / 7;
            const cellHeight = 100 / rows;

            const left = range.startCol * cellWidth;
            const width = (range.endCol - range.startCol + 1) * cellWidth;

            // ✅ row 중앙
            const top = range.row * cellHeight + cellHeight / 2;

            const scheduleStart = new Date(range.schedule.startDate);
            const scheduleEnd = new Date(range.schedule.endDate);

            /** 이 row가 포함하는 실제 날짜들 */
            const rowDates = calendarDays.slice(
              range.row * 7,
              range.row * 7 + 7
            );

            const isStart =
              rowDates.some((d, i) =>
                i === range.startCol &&
                d.toDateString() === scheduleStart.toDateString()
              );

            const isEnd =
              rowDates.some((d, i) =>
                i === range.endCol &&
                d.toDateString() === scheduleEnd.toDateString()
              );

            return (
              <div
                key={`${range.schedule.id}-${idx}`}
                onClick={(e) => handleScheduleClick(e, range.schedule)}
                className="absolute pointer-events-auto cursor-pointer"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: 'translateY(-50%)',
                  width: `${width}%`,

                  height: `${cellHeight}%`,

                  backgroundColor: range.schedule.color,
                  opacity: 0.7,

                  borderRadius:
                    isStart && isEnd
                      ? '999px'
                      : isStart
                      ? '999px 0 0 999px'
                      : isEnd
                      ? '0 999px 999px 0'
                      : '0',

                  zIndex: 0,
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
