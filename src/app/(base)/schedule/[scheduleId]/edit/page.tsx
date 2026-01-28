"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page/PageHeader";
import ScheduleForm from "@/components/schedule/ScheduleForm";
import { useScheduleById } from "@/lib/queries/schedule/queries";
import { useUpdateSchedule } from "@/lib/queries/schedule/mutations";

interface PageProps {
  params: Promise<{ scheduleId: string }>;
}

interface ScheduleFormData {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  color: string;
}

export default function ScheduleEditPage({ params }: PageProps) {
  const router = useRouter();
  const { scheduleId } = use(params);

  // 일정 조회
  const { data: schedule, isLoading, isError } = useScheduleById(scheduleId);
  const updateScheduleMutation = useUpdateSchedule();

  const handleSubmit = async (data: ScheduleFormData) => {
    try {
      await updateScheduleMutation.mutateAsync({
        id: scheduleId,
        data: {
          title: data.title,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          color: data.color,
        },
      });
      router.push(`/schedule/${scheduleId}`);
    } catch (error) {
      console.error("일정 수정 실패:", error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="w-full h-full p-4 sm:p-6 pt-20 lg:pt-6">
        <PageHeader title="일정 수정" isBackButton />
        <div className="mt-6 text-center text-gray text-sm sm:text-base">
          로딩 중...
        </div>
      </div>
    );
  }

  if (isError || !schedule) {
    return (
      <div className="w-full h-full p-4 sm:p-6 pt-20 lg:pt-6">
        <PageHeader title="일정 수정" isBackButton />
        <div className="mt-6 text-center text-gray text-sm sm:text-base">
          일정을 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  const initialData: ScheduleFormData = {
    title: schedule.title,
    startDate: schedule.startDate,
    endDate: schedule.endDate,
    description: schedule.description,
    color: schedule.color,
  };

  return (
    <div className="w-full h-full pt-20 lg:pt-0">
      <div className="p-4 sm:p-6">
        <PageHeader title="일정 수정" isBackButton />
      </div>

      <div className="px-4 sm:px-10 pb-10">
        <ScheduleForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="수정"
        />
      </div>
    </div>
  );
}