import { GetRemainingDays } from "@/utils/date";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { Event } from "@/lib/types/events";
import { useRouter } from "next/navigation";
import { useDeleteEvent } from "@/lib/queries/events/mutations";
import { ActionBarItem } from "../common/action/ActionBar";
import ActionBarTrigger from "../common/action/ActionBarTrigger";
import { Lost } from "@/lib/types/losts";


export const LostCard = ({lost}: {lost: Lost}) => {
  const router = useRouter();
  const deleteEventMutation = useDeleteEvent();
  const actionItems: ActionBarItem[] = [
    
  {
    icon: <Trash2 size={24} />,
    label: '삭제',
    backgroundColor: '#F9F9F9',
    iconColor: '#FA5353',
    textColor: '#FA5353',
    onClick: () => deleteEventMutation.mutate(lost.id),
  },
  {
    icon: <Edit size={24} />,
    label: '수정',
    backgroundColor: '#F9F9F9',
    iconColor: '#FDC019',
    textColor: '#010101',
    onClick: () => router.push(`/losts/${lost.id}/edit`),
  },
];
    return (
        <div className=" w-full h-full flex flex-col items-start">
            <div className="w-full">
                <Image
                    src={lost.thumbnailUrl.url}
                    alt="이벤트 이미지"
                    width={233} 
                    height={233}
                    className="w-full h-[233px] aspect-square object-cover rounded-[20px]"
                    unoptimized
                />
            </div>
            <div className="flex items-center w-full pt-3 pb-1 min-w-0">
                <h2 className="text-lg text-black font-semibold truncate flex-1 min-w-0 pr-2">
                    {lost.title}
                </h2>
                <ActionBarTrigger items={actionItems} vertical={true}/>
            </div>
            <div className="text-sm font-regular text-gray line-clamp-2">
                {lost.description}
            </div>
        </div>
    );
};