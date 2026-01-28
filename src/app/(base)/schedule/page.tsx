'use client';
import { useState, useMemo } from 'react';
import PageCalendar from '@/components/schedule/PageCalendar';
import ScheduleList from '@/components/schedule/ScheduleList';
import ScheduleDetailPopup from '@/components/schedule/ScheduleDetailPopup';
import { useAllSchedules } from '@/lib/queries/schedule/queries';
import { Schedule } from '@/lib/types/schedule';

interface PopupState {
  schedules: Schedule[];
  position: { top: number; left: number };
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [popup, setPopup] = useState<PopupState | null>(null);

  // API를 통해 전체 스케줄 조회
  const { data: schedules = [], isError } = useAllSchedules();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleScheduleClick = (schedules: Schedule[], position?: { top: number; left: number }) => {
    if (position) {
      setPopup({
        schedules,
        position
      });
    } else {
      setPopup({ 
        schedules: schedules,
        position: { 
          top: window.scrollY + window.innerHeight / 2, 
          left: window.innerWidth / 2 - 140 
        } 
      });
    }
  };

  const handleClosePopup = () => {
    setPopup(null);
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-8 pt-20 lg:pt-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">일정</h1>
        <div className="flex items-center justify-center h-96">
          <p className="text-red-500 text-sm sm:text-base">일정을 불러오는데 실패했습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8 pt-20 lg:pt-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">일정</h1>
      
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1 w-full">
          <PageCalendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            schedules={schedules}
            onScheduleClick={handleScheduleClick}
          />
        </div>

        <div className="w-full lg:w-[427px]">
          <ScheduleList
            schedules={schedules}
            onScheduleClick={(schedule) => handleScheduleClick([schedule])}
          />
        </div>
      </div>

      {popup && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={handleClosePopup}
          />
          <ScheduleDetailPopup
            schedules={popup.schedules}
            position={popup.position}
            onClose={handleClosePopup}
          />
        </>
      )}
    </div>
  );
}