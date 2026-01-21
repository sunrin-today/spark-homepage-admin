'use client';
import { ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { scheduleDummyData } from '@/lib/scheduleDummy';

interface Schedule {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  color: string;
  description: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
};

interface ScheduleListProps {
  schedules?: Schedule[];
  onScheduleClick?: (schedule: Schedule) => void;
}

export default function ScheduleList({ 
  schedules = scheduleDummyData,
  onScheduleClick 
}: ScheduleListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState<'top' | 'middle' | 'bottom'>('top');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      
      if (scrollTop === 0) {
        setScrollState('top');
      } else if (scrollTop + clientHeight >= scrollHeight - 1) {
        setScrollState('bottom');
      } else {
        setScrollState('middle');
      }
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [schedules]);

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-3">총 {schedules.length}개</h2>
      
      <div 
        className="relative bg-white overflow-hidden"
        style={{ 
          borderRadius: '20px', 
          border: '1px solid #C3C3C3',
          height: 'calc(6 * 76px)'
        }}
      >
        {(scrollState === 'middle' || scrollState === 'bottom') && (
          <div 
            className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"
          />
        )}
        
        {(scrollState === 'top' || scrollState === 'middle') && (
          <div 
            className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"
          />
        )}
        
        <div 
          ref={containerRef}
          className="p-4 overflow-y-auto h-full"
        >
          <div className="space-y-2">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                onClick={() => onScheduleClick?.(schedule)}
                className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors px-2"
              >
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0"
                  style={{ backgroundColor: schedule.color }}
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-gray-900 mb-0.5">
                    {schedule.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(schedule.startDate)}
                  </p>
                </div>
                
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}