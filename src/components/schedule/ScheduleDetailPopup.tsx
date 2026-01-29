'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Schedule } from '@/lib/types/schedule';
import { formatKoreanDate } from '@/utils/date';

interface ScheduleDetailPopupProps {
  schedules: Schedule[];
  position: { top: number; left: number };
  onClose: () => void;
}

export default function ScheduleDetailPopup({ 
  schedules = [], 
  position, 
  onClose 
}: ScheduleDetailPopupProps) {
  const router = useRouter();
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

  const handleScheduleClick = (scheduleId: string) => {
    onClose(); // 팝업 닫기
    router.push(`/schedule/${scheduleId}`); 
  };

  if (schedules.length === 0) return null;

  return (
    <div 
      ref={popupRef}
      className="absolute bg-white rounded-2xl shadow-lg border border-gray z-50 overflow-hidden"
      style={{
        top: `${position.top + 10}px`,
        left: `${position.left}px`,
        width: '280px',
      }}
    >
      {schedules.map((schedule, index) => (
        <div 
          key={schedule.id}
          onClick={() => handleScheduleClick(schedule.id)}
          className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${
            index !== schedules.length - 1 ? 'border-b border-gray' : ''
          }`}
        >
          <div
            className="w-10 h-10 rounded-full flex-shrink-0"
            style={{ backgroundColor: schedule.color }}
          />
          
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-black mb-1">
              {schedule.title}
            </h3>
            <p className="text-sm text-gray">
              {formatKoreanDate(schedule.startDate)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}