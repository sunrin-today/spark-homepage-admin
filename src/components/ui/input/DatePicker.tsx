import InputCalendar from "@/components/schedule/InputCalendar";
import { X, Save } from "lucide-react";
import { useState } from "react";

interface DatePickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onCancel: () => void;
}

export const DatePicker = ({ 
  selectedDate: initialDate, 
  onDateSelect, 
  onCancel 
}: DatePickerProps) => {
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  return (
    <div className="w-[324px] p-3">
      <InputCalendar
        onDateSelect={(date) => {
          setSelectedDate(date);
        }}
        inputDate={selectedDate}
      />
      <div className="flex w-full justify-end gap-2">
        <button 
          onClick={(e) => {
            e.preventDefault();
            onCancel();
          }}
          type="button"
          className="flex px-2 py-1.5 text-sm text-gray rounded-lg gap-1 items-center"
        >
          <X className='w-4 h-4'/>
          취소
        </button>
        <button 
          onClick={(e) => {
            e.preventDefault();
            onDateSelect(selectedDate);
          }}
          type="button" 
          className="flex px-2 py-1.5 text-sm bg-black text-white rounded-lg gap-1 items-center"
        >
          <Save className='w-4 h-4'/>
          저장
        </button>
      </div>
    </div>
  );
};