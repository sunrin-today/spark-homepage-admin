import { GetRemainingDays } from "@/utils/date";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { Event } from "@/lib/types/events";
import { useRouter } from "next/navigation";
import { useDeleteEvent } from "@/lib/queries/events/mutations";
import { ActionBarItem } from "../common/action/ActionBar";
import ActionBarTrigger from "../common/action/ActionBarTrigger";


export const EventCard = ({event}: {event: Event}) => {
  const router = useRouter();
  const deleteEventMutation = useDeleteEvent();
  const actionItems: ActionBarItem[] = [
    
  {
    icon: <Trash2 size={24} />,
    label: '삭제',
    backgroundColor: '#F9F9F9',
    iconColor: '#FA5353',
    textColor: '#FA5353',
    onClick: () => deleteEventMutation.mutate(event.id),
  },
  {
    icon: <Edit size={24} />,
    label: '수정',
    backgroundColor: '#F9F9F9',
    iconColor: '#FDC019',
    textColor: '#010101',
    onClick: () => router.push(`/events/${event.id}/edit`),
  },
];
    return (
        <div className=" w-full h-full flex flex-col items-start">
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
                    {GetRemainingDays(event.deadline)}일 남음
                </p>
            </div>
            <div className="flex items-center w-full pt-3 pb-1 min-w-0">
                <h2 className="text-lg text-black font-semibold truncate flex-1 min-w-0 pr-2">
                    {event.name}
                </h2>
                <ActionBarTrigger items={actionItems} vertical={true}/>
            </div>
            <div className="text-sm font-regular text-gray line-clamp-2">
                {event.description}
            </div>
        </div>
    );
};