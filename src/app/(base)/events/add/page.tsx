"use client"
import EventForm from "@/components/events/EventForm";
import PageHeader from "@/components/layout/page/PageHeader";
import { useCreateEvent } from "@/lib/queries/events/mutations";
export default function EventsAdd() {
  const { mutate: createEvent, isPending } = useCreateEvent();
  return (
    <div className="px-8 py-12 max-w-4xl">
      <PageHeader title="이벤트 추가" isBackButton />
      
      <EventForm
        mode="create"
        isPending={isPending}
        mutation={createEvent}
      />
    </div>
  );
}