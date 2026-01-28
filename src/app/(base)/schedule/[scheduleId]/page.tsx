"use client";

import { use } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page/PageHeader";
import { useScheduleById } from "@/lib/queries/schedule/queries";
import { useDeleteSchedule } from "@/lib/queries/schedule/mutations";
import { useModal } from "@/contexts/ModalContexts";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";

interface PageProps {
  params: Promise<{ scheduleId: string }>;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
};

export default function ScheduleDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { scheduleId } = use(params);
  const { open, close } = useModal();
  
  // 일정 조회
  const { data: schedule, isLoading, isError } = useScheduleById(scheduleId);
  const deleteScheduleMutation = useDeleteSchedule();

  const handleEdit = () => {
    router.push(`/schedule/${scheduleId}/edit`);
  };

  const handleDelete = () => {
    open(
      <ConfirmModal
        title="일정 삭제"
        message="정말로 삭제하시겠습니까?"
        onClose={() => close()}
        onConfirm={async () => {
          try {
            // 먼저 페이지로 이동
            router.push("/schedule");
            // 그 다음 삭제 실행
            await deleteScheduleMutation.mutateAsync(scheduleId);
            close();
          } catch (error) {
            console.error("일정 삭제 실패:", error);
            // 에러 발생 시 다시 상세 페이지로 복귀
            router.push(`/schedule/${scheduleId}`);
            close();
          }
        }}
      />
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-full p-4 sm:p-6 pt-20 lg:pt-6">
        <PageHeader title="일정 상세" isBackButton />
        <div className="mt-6 text-center text-gray-500 text-sm sm:text-base">
          로딩 중...
        </div>
      </div>
    );
  }

  if (isError || !schedule) {
    return (
      <div className="w-full h-full p-4 sm:p-6 pt-20 lg:pt-6">
        <PageHeader title="일정 상세" isBackButton />
        <div className="mt-6 text-center text-gray-500 text-sm sm:text-base">
          일정을 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full pt-20 lg:pt-0">
      <div className="p-4 sm:p-6">
        <PageHeader title="일정 상세" isBackButton />
      </div>
      
      <div className="px-4 sm:px-10">
        <div className="bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center mb-6 sm:mb-8 gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div 
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex-shrink-0" 
                style={{ backgroundColor: schedule.color }}
              />
              <h2 className="text-lg sm:text-xl font-semibold text-black truncate">
                {schedule.title}
              </h2>
            </div>
            
            <div className="flex gap-2 sm:ml-[20px]">
              <button
                onClick={handleEdit}
                className="w-8 h-8 p-1.5 flex items-center justify-center rounded-lg transition-colors"
                style={{ backgroundColor: "rgba(253, 192, 25, 0.2)" }}
              >
                <Pencil className="w-5 h-5" style={{ color: "#FDC019" }} />
              </button>

              <button
                onClick={handleDelete}
                className="w-8 h-8 p-1.5 flex items-center justify-center rounded-lg transition-colors"
                style={{ backgroundColor: "rgba(250, 83, 83, 0.2)" }}
                disabled={deleteScheduleMutation.isPending}
              >
                <Trash2 className="w-5 h-5" style={{ color: "#FA5353" }} />
              </button>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              <div>
                <div className="text-sm text-[#767676] mb-2">시작일</div>
                <div className="text-base text-black">
                  {formatDate(schedule.startDate)}
                </div>
              </div>
              <div>
                <div className="text-sm text-[#767676] mb-2">종료일</div>
                <div className="text-base text-black">
                  {formatDate(schedule.endDate)}
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm text-[#767676] mb-2">설명</div>
              <div className="text-base text-black break-words">
                {schedule.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}