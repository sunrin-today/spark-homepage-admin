"use client"
import { useRouter } from "next/navigation";
import EventForm from "@/components/events/EventForm";
import { useParams } from "next/navigation";
import PageHeader from "@/components/layout/page/PageHeader";
import { useEvent } from "@/lib/queries/events/queries";
import { useUpdateEvent } from "@/lib/queries/events/mutations";
export default function EventEdit() {
    const router = useRouter(); 
    const id = useParams().eventId!.toString();
    const { data: eventDetail, isLoading, error } = useEvent(id);
    const { mutate: updateEvent, isPending, error: updateError } = useUpdateEvent(id, eventDetail?.detailImages || []);
    return (
    <div className="px-8 py-12 gap-[10px] flex flex-col">
        <PageHeader title="이벤트 수정" isBackButton />
        
        {eventDetail &&
            <EventForm
                mode="update"
                initialData={eventDetail}
                mutation={updateEvent}
                error={updateError ? "이벤트를 수정하는 중 오류가 발생했습니다: " + updateError.message : ""}
                isPending={isPending}
            />
        }
    </div>
    );
}
