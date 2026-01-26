"use client";

import { use } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page/PageHeader";
import { scheduleDummyData } from "@/lib/scheduleDummy";

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
  
  // 해당 일정 찾기
  const schedule = scheduleDummyData.find((s) => s.id === scheduleId);

  // 일정을 찾지 못 했을 때
  if (!schedule) {
    return (
      <div className="w-full h-full p-6">
        <PageHeader title="일정 상세" isBackButton />
        <div className="mt-6 text-center text-gray-500">
          일정을 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    // TODO: 편집 기능 구현
    console.log("편집", scheduleId);
    // router.push(`/schedule/${scheduleId}/edit`);
  };

  const handleDelete = () => {
    // TODO: 삭제 기능 구현
    if (confirm("정말 삭제하시겠습니까?")) {
      console.log("삭제", scheduleId);
      router.push("/schedule");
    }
  };

  return (
    <div className="w-full h-full">
      <div className="p-6">
        <PageHeader title="일정 상세" isBackButton />
      </div>
      
      <div className="pl-10">
        <div className="bg-white">
          <div className="flex items-center mb-8">
            <div 
              className="w-7 h-7 rounded-full flex-shrink-0" 
              style={{ backgroundColor: schedule.color }}
            />
            <h2 className="text-xl font-semibold text-black ml-3">
              {schedule.title}
            </h2>
            <div className="flex gap-2 ml-[20px]">
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
                >
                    <Trash2 className="w-5 h-5" style={{ color: "#FA5353" }} />
                </button>
                </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-8">
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
              <div className="text-base text-black">
                {schedule.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}