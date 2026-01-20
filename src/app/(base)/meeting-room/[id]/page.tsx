"use client"
import { Check, X } from "lucide-react";
import { InfoColumn } from "@/components/ui/InfoCol";
import { useParams } from "next/navigation";
import { formatKoreanDate } from "@/utils/date";
import PageHeader from "@/components/layout/page/PageHeader";   
import { useMeetingRoomDetailQuery } from "@/lib/queries/meeting-room/queries";
import { useApproveRentalMutation, useRejectRentalMutation } from "@/lib/queries/meeting-room/mutations";
const STATUS = ['승인', '미승인', '승인 대기 중'] as const;
export default function MeetingRoomDetail() {

  const params = useParams();
  const id = params.id!.toString();
  const { data: meetingRoomData, error } = useMeetingRoomDetailQuery(id);
  const { mutate: approveRental, isPending: isApproving } = useApproveRentalMutation();
  const { mutate: rejectRental, isPending: isRejecting } = useRejectRentalMutation();
  const isProcessing = isApproving || isRejecting;
  const isDisabled = isProcessing || meetingRoomData?.status !== 2;
  const statusMessage = meetingRoomData?.status !== undefined ? STATUS[meetingRoomData.status] : '';

  return (
    <div className="px-8 py-12">
      <PageHeader title="소회의실 대여 신청서 상세보기" isBackButton />
      <div className="bg-white rounded-lg shadow-sm py-8 px-10">
        <div className="space-y-4">
          <InfoColumn label="신청자" value={meetingRoomData?.borrower?.name || '-'} />
          <InfoColumn 
            label="상태" 
            value={ // APPROVED = 0 REJECTED = 1 WAITING = 2
                <div className="flex items-center space-x-2">
                  <span 
                    className={`inline-flex items-center p-2 rounded-full text-xs font-medium 
                    ${meetingRoomData?.status === 0 ? 'bg-toggle-checked' 
                    : meetingRoomData?.status === 1 ? 'bg-black' 
                    : 'bg-[#FFE284]'}`}
                  />
                  <span>
                    {statusMessage}
                  </span>
                </div>
            } 
          />
          <InfoColumn label="대여신청일" value={meetingRoomData?.wantedDate ? formatKoreanDate(meetingRoomData.wantedDate) : '-'} />
          <InfoColumn label="대여목적" value={meetingRoomData?.purpose || '-'} />
        
        </div>
        {error && <p className="text-sunday">{error.message}</p>}
        <div className="flex justify-end items-center text-base gap-2 pt-4 sm:flex-row flex-col">
            {meetingRoomData && meetingRoomData.status !== 2 && <p className="text-[#000000] text-xs">이미 {statusMessage}된 신청서입니다.</p>}
            <div className={"flex gap-[15px]" + (isDisabled ? " opacity-40" : "")}>
             {/* TODO: 버튼 컴포넌트로 변경 */}
              <button onClick={() => rejectRental(id)} disabled={isDisabled} className="px-2 py-[6px] flex items-center gap-1 text-gray rounded-lg"><X/>취소</button>
              <button onClick={() => approveRental(id)} disabled={isDisabled} className="px-2 py-[6px] flex items-center gap-1 bg-[#010101] text-white rounded-lg"><Check/>수락</button>
            </div>
        </div>  
      </div>

    </div>
  );
}