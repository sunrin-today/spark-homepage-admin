"use client"
import eventsApi from "@/lib/api/events";
import { useRouter } from "next/navigation";
import EventForm from "@/components/events/EventForm";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/layout/page/PageHeader";
export default function EventEdit() {
    const router = useRouter(); 
    const id = useParams().eventId;
    const [event, setEvent] = useState<any>(null);
    useEffect(() => {
  const fetchEvent = async () => {
    try {
      const eventData = await eventsApi.getEventById(id as string);
      setEvent(eventData);
      console.log("event 날것", eventData);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  fetchEvent();
}, [id]);  // Add id to dependency array to refetch if id changes

    return (
    <div className="max-w-4xl px-8 py-12">
        <PageHeader title="이벤트 수정" isBackButton />
        
        {event ? (
            <EventForm
                mode="update"
                initialData={event as any}
                onSubmit={async data => {
                    await eventsApi.updateEvent(id as string, data);
                    router.push("/events");
                }}
            />
        ) : (
            <div>로딩 중...</div>
        )}
    </div>
    );
}
