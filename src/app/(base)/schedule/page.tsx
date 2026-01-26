'use client';
import { useState } from 'react';
import PageCalendar from '@/components/schedule/PageCalendar';
import ScheduleList from '@/components/schedule/ScheduleList';
import ScheduleDetailPopup from '@/components/schedule/ScheduleDetailPopup';
import { scheduleDummyData } from '@/lib/scheduleDummy';

interface Schedule {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  color: string;
  description: string;
}

interface PopupState {
  schedules: Schedule[];
  position: { top: number; left: number };
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [popup, setPopup] = useState<PopupState | null>(null);

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

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-8">일정</h1>
      
      <div className="flex gap-8">
        <div className="flex-1">
          <PageCalendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            schedules={scheduleDummyData}
            onScheduleClick={handleScheduleClick}
          />
        </div>

        <div className="w-[427px]">
          <ScheduleList
            schedules={scheduleDummyData}
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