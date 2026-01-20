"use client"
import eventsApi from "@/lib/api/events";
import { useRouter } from "next/navigation";
import EventForm from "@/components/events/EventForm";
import { useParams } from "next/navigation";
import { Event } from "@/lib/types/events";
import PageHeader from "@/components/layout/page/PageHeader";
import { useEvent } from "@/lib/queries/events/queries";
import { useUpdateEvent } from "@/lib/queries/events/mutations";
import { useState } from "react";
export default function EventEdit() {
    const router = useRouter(); 
    const id = useParams().eventId!.toString();
    const { data: eventDetail, isLoading, error } = useEvent(id);
    const { mutate: updateEvent, isPending } = useUpdateEvent(id);
    console.log(eventDetail, " 이것은 날것")
    return (
    <div className="max-w-4xl px-8 py-12">
        <PageHeader title="이벤트 수정" isBackButton />
        
            
        {isLoading && <div>로딩 중...</div>}
        {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                이벤트를 불러오는 중 오류가 발생했습니다: {error.message}
            </div>
        )}
        {eventDetail &&
            <EventForm
                mode="update"
                initialData={eventDetail}
                mutation={updateEvent}
                isPending={isPending}
            />
        }
    </div>
    );
}
