"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page/PageHeader";
import ScheduleForm from "@/components/schedule/ScheduleForm";
import { scheduleDummyData } from "@/lib/scheduleDummy";

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

  const schedule = scheduleDummyData.find((s) => s.id === scheduleId);

  if (!schedule) {
    return (
      <div className="w-full h-full p-6">
        <PageHeader title="일정 수정" isBackButton />
        <div className="mt-6 text-center text-gray-500">
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

  const handleSubmit = (data: ScheduleFormData) => {
    console.log("일정 수정:", scheduleId, data);
    // TODO: API 호출 및 데이터 저장
    router.push(`/schedule/${scheduleId}`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="w-full h-full">
      <div className="p-6">
        <PageHeader title="일정 수정" isBackButton />
      </div>

      <div className="px-10 pb-10">
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