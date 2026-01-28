"use client";
import ActionBarTrigger from "@/components/common/action/ActionBarTrigger";
import PageHeader from "@/components/layout/page/PageHeader";
import { ActionBarItem } from "@/components/common/action/ActionBar";
import { Trash2, Pencil } from "lucide-react";
import { InfoColumn } from "@/components/ui/InfoCol";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useTableSort } from "@/lib/hooks/useTableSort";
import { useModal } from "@/contexts/ModalContexts";
import { useEffect } from "react";
import EventDeleteModal from "@/components/events/EventDeleteModal";
import { useEvent } from "@/lib/queries/events/queries";
import { formatKoreanDate } from "@/utils/date";
    export default function EventDetailPage() {
    const params = useParams();
    const eventId = params.eventId!.toString();
    const { data:eventData} = useEvent(eventId);
    const { sort, onSortChange } = useTableSort({ key: "createdAt", order: "DESC" });
    const { open, close } = useModal();
    const router = useRouter();

    const actionItems: ActionBarItem[] = [
        {
            icon: <Trash2 size={24} />,
            label: '삭제',
            hoverBackgroundColor: 'rgba(250, 83, 83, 0.2)',
            backgroundColor: '#F9F9F9',
            iconColor: '#FA5353',
            textColor: '#FA5353',
            onClick: () => {
                open(<EventDeleteModal eventId={eventId}/>)
            },
        },
        {
            icon: <Pencil size={24} />,
            label: '수정',
            backgroundColor: '#F9F9F9',
            iconColor: '#FDC019',
            textColor: '#010101',
            onClick: () => router.push(`/events/${eventId}/edit`),
        }]
    return (
        <div className="px-8 py-12 gap-[10px] flex flex-col">
            <PageHeader title="이벤트 상세보기" isBackButton >
                <ActionBarTrigger items={actionItems} />
            </PageHeader>
            <div className="flex flex-col px-2 gap-[10px]">
                
                {eventData?.thumbnail && (
                    <Image src={eventData?.thumbnail.url || ''} alt="lost" width={351} height={351} 
                        className="object-cover rounded-lg h-[351px]" 
                        unoptimized 
                    />
                )}
                <InfoColumn
                    label="제목"
                    value={eventData?.name || '-'}
                />
                <div className="flex sm:flex-row flex-col gap-4">
                    <InfoColumn
                        label="시작일"
                        value={eventData?.startedAt ? formatKoreanDate(eventData?.startedAt): '-'}
                    />
                    <InfoColumn
                        label="종료일"
                        value={eventData?.deadline ? formatKoreanDate(eventData?.deadline): '-'} 
                    />
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 ">
                {eventData?.detailImages.map((image, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-[400px] h-[280px] rounded-lg overflow-x-auto bg-gray"
                    >
                        <Image
                            width={400}
                            height={280}
                            unoptimized
                            src={image.url}
                            alt={`이벤트 이미지 ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
                </div>
                <InfoColumn
                    label="설명"
                    value={eventData?.description || '-'}
                />
            </div>
        </div>
    );
}
