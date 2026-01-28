import { getRemainingDays } from "@/utils/date";
import { Trash2, Pencil } from "lucide-react";
import Image from "next/image";
import { Event } from "@/lib/types/events";
import { useRouter } from "next/navigation";
import { ActionBarItem } from "../common/action/ActionBar";
import ActionBarTrigger from "../common/action/ActionBarTrigger";
import { useModal } from "@/contexts/ModalContexts";
import EventDeleteModal from "./EventDeleteModal";
import Link from "next/link";

export const EventCard = ({event}: {event: Event}) => {
  const router = useRouter();
  const {open} = useModal();
  const actionItems: ActionBarItem[] = [
    
  {
    icon: <Trash2 size={24} />,
    label: '삭제',
    backgroundColor: '#F9F9F9',
    hoverBackgroundColor: 'rgba(250, 83, 83, 0.2)',
    iconColor: '#FA5353',
    textColor: '#FA5353',
    onClick: () => open(<EventDeleteModal eventId={event.id}/>),
  },
  {
    icon: <Pencil size={24} />,
    label: '수정',
    backgroundColor: '#F9F9F9',
    iconColor: '#FDC019',
    textColor: '#010101',
    onClick: () => router.push(`/events/${event.id}/edit`),
  },
];
    return (
        <div className=" w-full h-full flex flex-col gap-3 min-h-0 items-start">
            <Link href={`/events/${event.id}`} className="w-full"> 
                <div className="w-full relative">
                    <Image
                        src={event.thumbnail.url}
                        alt="이벤트 이미지"
                        width={400} 
                        height={250}
                        className="w-full h-[250px] object-cover rounded-[20px]"
                        unoptimized
                    />
                    <p className="absolute bottom-2 left-2 text-xs px-3 py-2 bg-white bg-opacity-80 text-black rounded-full">
                        {getRemainingDays(event.deadline)}
                    </p>
                </div>
            </Link>
            <div className="w-full flex flex-col gap-[5px]">
                <div className="flex items-center w-full">
                    <h2 className="text-lg text-black font-semibold truncate flex-1">
                        {event.name}
                    </h2>
                    <ActionBarTrigger items={actionItems} vertical={true}/>
                </div>
                <p className="text-sm w-full font-normal text-gray min-h-0 break-words line-clamp-2">
                    {event.description}
                </p>
            </div>
        </div>
    );
};