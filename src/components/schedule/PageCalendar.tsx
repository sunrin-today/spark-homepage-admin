import React from 'react';
import CalendarCore from './CalendarCore';

interface Schedule {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  color: string;
  description: string;
}

interface PageCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  schedules?: Schedule[];
  onScheduleClick?: (
    schedules: Schedule[],
    position: { top: number; left: number }
  ) => void;
}

const PageCalendar: React.FC<PageCalendarProps> = ({
  selectedDate,
  onDateSelect,
  schedules = [],
  onScheduleClick,
}) => {
  const normalizeDate = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const getScheduleRanges = (calendarDays: Date[]) => {
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
    <CalendarCore selectedDate={selectedDate} onDateSelect={onDateSelect}>
      {(renderProps) => {
        const {
          calendarDays,
          handleDateClick,
          getDateColor,
        } = renderProps;

        const scheduleRanges = getScheduleRanges(calendarDays);

        return (
          <div className="relative">
            <div className="grid grid-cols-7">
              {calendarDays.map((date, index) => {
                const dayOfWeek = date.getDay();

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
                    <span className="relative z-10">
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

                const top = range.row * cellHeight + cellHeight / 2;

                const scheduleStart = new Date(range.schedule.startDate);
                const scheduleEnd = new Date(range.schedule.endDate);

                // 이 row가 포함하는 실제 날짜들
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
                      opacity: 0.15,
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
        );
      }}
    </CalendarCore>
  );
};

export default PageCalendar;