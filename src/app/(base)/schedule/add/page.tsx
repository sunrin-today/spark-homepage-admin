"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page/PageHeader";
import ScheduleForm from "@/components/schedule/ScheduleForm";

interface ScheduleFormData {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  color: string;
}

export default function ScheduleAddPage() {
  const router = useRouter();

  const handleSubmit = (data: ScheduleFormData) => {
    console.log("일정 추가:", data);
    // TODO: API 호출 및 데이터 저장
    router.push("/schedule");
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