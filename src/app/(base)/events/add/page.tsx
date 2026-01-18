"use client"
import eventsApi from "@/lib/api/events";
import { useRouter } from "next/navigation";
import EventForm from "@/components/events/EventForm";
import { EventCreateForm } from "@/lib/types/events";
export default function EventsAdd() {
  const router = useRouter(); 
  
  return (
    <div className="px-8 py-12 max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">이벤트 등록</h1>
      
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