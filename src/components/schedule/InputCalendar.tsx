import React from 'react';
import CalendarCore from './CalendarCore';

interface InputCalendarProps {
  inputDate?: Date | string;
  onDateSelect?: (date: Date) => void;
}

const InputCalendar: React.FC<InputCalendarProps> = ({
  inputDate,
  onDateSelect,
}) => {
  const parsedInputDate = inputDate
    ? inputDate instanceof Date
      ? inputDate
      : new Date(inputDate)
    : null;

  return (
    <CalendarCore 
      selectedDate={parsedInputDate || undefined} 
      onDateSelect={onDateSelect}
      className="w-full bg-white rounded-lg p-3"
    >
      {(renderProps) => {
        const {
          calendarDays,
          handleDateClick,
          getDateColor,
          isSameDay,
        } = renderProps;

        return (
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
                    `}
                  >
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
          </div>
        );
      }}
    </CalendarCore>
  );
};

export default InputCalendar;