'use client';
import { useEffect, useRef } from 'react';

interface Schedule {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  color: string;
  description: string;
}

interface ScheduleDetailPopupProps {
  schedules: Schedule[];
  position: { top: number; left: number };
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
};

export default function ScheduleDetailPopup({ 
  schedules = [], 
  position, 
  onClose 
}: ScheduleDetailPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (schedules.length === 0) return null;

  return (
    <div 
      ref={popupRef}
      className="absolute bg-white rounded-2xl shadow-lg border border-gray-200 z-50 overflow-hidden"
      style={{
        top: `${position.top + 10}px`,
        left: `${position.left}px`,
        width: '280px',
      }}
    >
      {schedules.map((schedule, index) => (
        <div 
          key={schedule.id}
          className={`p-4 flex items-start gap-3 ${
            index !== schedules.length - 1 ? 'border-b border-gray-100' : ''
          }`}
        >
          <div
            className="w-10 h-10 rounded-full flex-shrink-0"
            style={{ backgroundColor: schedule.color }}
          />
          
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              {schedule.title}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDate(schedule.startDate)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}