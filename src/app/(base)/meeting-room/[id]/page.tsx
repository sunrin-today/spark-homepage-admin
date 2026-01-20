"use client"
import { Check, ChevronLeft, X } from "lucide-react";
import { InfoColumn } from "@/components/ui/InfoCol";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatKoreanDate } from "@/utils/date";
const STATUS = {
  approved: '승인',
  rejected: '미승인',
  waiting: '승인 대기 중'
} as const;
export default function MeetingRoomDetail() {
  const [meetingRoom, setMeetingRoom] = useState({
    name: '',
    status: '',
    wantedDate: '',
    purpose: ''
  });

  const params = useParams();
  const id = params.id;

  useEffect(() => {
    if (!id) return;

    const fetchMeetingRoom = async () => {
      try {
        // const response = await fetch(`/api/meeting-rooms/${id}`);
        
        // const data = await response.json();
        setMeetingRoom(prev => ({
          ...prev,
          name: '회의실 ' + id,
          status: "approved",
          wantedDate: new Date().toISOString(),
          purpose: '회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의회의'
        }));
      } catch (error) {
        console.error('Error fetching meeting room:', error);
      }
    };

    fetchMeetingRoom();
  }, [id]);

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-6">
        <button 
          className="p-1 -ml-1 rounded-full hover:bg-gray-100"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold">
          {meetingRoom?.name || '로딩 중...'}
        </h1>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-4">
          <InfoColumn label="신청자" value={meetingRoom?.name || '-'} />
          <InfoColumn 
            label="상태" 
            value={
                <div className="flex items-center space-x-2">
                  <span 
                    className={`inline-flex items-center p-2 rounded-full text-xs font-medium 
                    ${meetingRoom?.status === 'approved' ? 'bg-toggle-checked' 
                    : meetingRoom?.status === 'rejected' ? 'bg-black' 
                    : 'bg-software'}`}
                  />
                  <span className={`${meetingRoom?.status === 'approved' ? 'text-green-800' : meetingRoom?.status === 'rejected' ? 'text-red-800' : 'text-yellow-800'}`}>
                    {STATUS[meetingRoom?.status as keyof typeof STATUS] || '승인'}
                  </span>
                </div>
            } 
          />
          <InfoColumn label="대여신청일" value={meetingRoom?.wantedDate ? formatKoreanDate(meetingRoom.wantedDate) : '-'} />
          <InfoColumn label="대여목적" value={meetingRoom?.purpose || '-'} />
        
        </div>
        <div className="flex justify-end items-center text-base gap-2 pt-4 sm:flex-row flex-col">
            {meetingRoom.status!='waiting' && <p className="text-black text-sm">이미 처리된 신청서입니다.</p>}
            <div className="flex gap-2">
              <button className="px-3 py-2 flex items-center gap-2 text-gray-600 rounded-lg"><X/>취소</button>
              <button className="px-2 py-2 flex items-center gap-2 bg-black text-white rounded-lg"><Check/>승인</button>
            </div>
        </div>  
      </div>

    </div>
  );
}