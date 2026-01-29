'use client';
import { ChevronRight, Plus } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Schedule } from '@/lib/types/schedule';
import { formatKoreanDate } from '@/utils/date';

interface ScheduleListProps {
  schedules?: Schedule[];
  onScheduleClick?: (schedule: Schedule) => void;
}

export default function ScheduleList({ 
  schedules = [],
  onScheduleClick
}: ScheduleListProps) {
  const router = useRouter();
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

  const handleClick = (schedule: Schedule) => {
    router.push(`/schedule/${schedule.id}`);
  };

  const handleAddClick = () => {
    router.push('/schedule/add');
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-medium">총 {schedules.length}개</h2>
        <button
          onClick={handleAddClick}
          className="px-2 py-1.5 bg-black text-white rounded-lg text-[10px] font-semibold transition-colors flex items-center gap-1"
        >
          <Plus className="w-[18px] h-[18px]" />
          <span>등록하기</span>
        </button>
      </div>
      
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
                onClick={() => handleClick(schedule)}
                className="flex items-center gap-3 py-2 cursor-pointer rounded-lg transition-colors px-2"
              >
                <div
                  className="w-7 h-7 rounded-full flex-shrink-0"
                  style={{ backgroundColor: schedule.color }}
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-black mb-0.5">
                    {schedule.title}
                  </h3>
                  <p className="text-sm text-gray">
                    {formatKoreanDate(schedule.startDate)}
                  </p>
                </div>
                
                <ChevronRight className="w-5 h-5 text-[#D9D9D9] flex-shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}