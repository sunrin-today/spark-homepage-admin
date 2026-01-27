"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page/PageHeader";
import ScheduleForm from "@/components/schedule/ScheduleForm";
import { useCreateSchedule } from "@/lib/queries/schedule/mutations";

interface ScheduleFormData {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  color: string;
}

export default function ScheduleAddPage() {
  const router = useRouter();
  const createScheduleMutation = useCreateSchedule();

  const handleSubmit = async (data: ScheduleFormData) => {
    try {
      await createScheduleMutation.mutateAsync({
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        color: data.color,
        type: "ACADEMIC", 
      });
      router.push("/schedule");
    } catch (error) {
      console.error("일정 생성 실패:", error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="w-full h-full">
      <div className="p-6">
        <PageHeader title="일정 추가" isBackButton />
      </div>

      <div className="px-10 pb-10">
        <ScheduleForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="추가"
        />
      </div>
    </div>
  );
}