"use client"
import eventsApi from "@/lib/api/events";
import { useRouter } from "next/navigation";
import EventForm from "@/components/events/EventForm";
import { EventCreateForm } from "@/lib/types/events";
import PageHeader from "@/components/layout/page/PageHeader";
export default function EventsAdd() {
  const router = useRouter(); 
  
  return (
    <div className="px-8 py-12 max-w-4xl">
      <PageHeader title="이벤트 추가" isBackButton />
      
      <EventForm
        mode="create"
        onSubmit={async (data: EventCreateForm) => {
          await eventsApi.createEvent(data);
          router.push("/events");
        }}
      />
    </div>
  );
}