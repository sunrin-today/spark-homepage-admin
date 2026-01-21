import { useState, useRef, useEffect } from "react";
import { CalendarDaysIcon } from "lucide-react";
import BaseInput from "./Input";
import { formatKoreanDate } from "@/utils/date";

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  name?: string;
}

export const DateInput = ({
  value,
  onChange,
  placeholder = "날짜를 선택해주세요",
  className = "",
  name,
}: DateInputProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);


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
      <div onClick={handleInputClick} className="w-full relative cursor-pointer">
        <BaseInput
          name={name}
          leftIcon={<CalendarDaysIcon size={20}/>}
          value={formatKoreanDate(value)}
          onChange={() => {}} // Read-only
          placeholder={placeholder}
          readOnly
          className={className}
          ref={inputRef}
        />
      </div>
  );
};