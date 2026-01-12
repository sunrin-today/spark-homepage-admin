import { useState, useRef, useEffect } from "react";
import { CalendarDaysIcon } from "lucide-react";
import BaseInput from "./Input";

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const DateInput = ({
  value,
  onChange,
  placeholder = "날짜를 선택해주세요",
  className = "",
}: DateInputProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // "2023-12-31" -> "2023년 12월 31일"
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${year}년 ${month}월 ${day}일`;
  };

  const handleInputClick = () => {
    setIsCalendarOpen(true);
    // TODO: 캘린더 열기
  };

//   const handleDateSelect = (selectedDate: Date) => {
//     const formattedDate = selectedDate.toISOString().split("T")[0]; 
//     // YYYY-MM-DD format
//     onChange(formattedDate);
//     setIsCalendarOpen(false);
//   };

  return (
    <div className="relative">
      <div onClick={handleInputClick} className="cursor-pointer">
        <BaseInput
          leftIcon={<CalendarDaysIcon size={20}/>}
          value={formatDisplayDate(value)}
          onChange={() => {}} // Read-only
          placeholder={placeholder}
          readOnly
          className={className}
          ref={inputRef}
        />
      </div>

      {/* TODO: 달력 선택 추가하기 */}
      {/* Example: */}
      {/* {isCalendarOpen && (
        <div className="absolute z-10 mt-1">
          <CustomCalendar
            selectedDate={value ? new Date(value) : null}
            onSelect={handleDateSelect}
            onClose={() => setIsCalendarOpen(false)}
          />
        </div>
      )} */}
    </div>
  );
};