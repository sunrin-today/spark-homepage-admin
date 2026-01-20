import { GetRemainingDays } from "@/utils/date";
import { EllipsisVertical, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import ActionBar from "../common/action/ActionBar";
import { Event } from "@/lib/types/events";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDeleteEvent } from "@/lib/queries/events/mutations";
import { ActionBarItem } from "../common/action/ActionBar";


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
  const [isActionBarOpen, setIsActionBarOpen] = useState(false);
  const actionBarRef = useRef<HTMLDivElement>(null);
  const handleEllipsisClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActionBarOpen(!isActionBarOpen);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionBarRef.current && !actionBarRef.current.contains(event.target as Node)) {
        setIsActionBarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
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
                <div className="flex-shrink-0 relative" ref={actionBarRef}>
                    <EllipsisVertical 
                    onClick={handleEllipsisClick} 
                    className="text-sm w-5 h-5 text-gray cursor-pointer" 
                    />
                    
                    {isActionBarOpen && (
                        <div className="absolute top-full w-[200px] right-0 z-50">
                        <ActionBar
                            title="액션"
                            items={actionItems}
                        />
                        </div>
                    )}
                </div>
            </div>
            <div className="text-sm font-regular text-gray line-clamp-2">
                {event.description}
            </div>
        </div>
    );
};