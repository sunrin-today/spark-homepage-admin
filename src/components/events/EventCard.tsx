import { GetRemainingDays } from "@/utils/date";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Event } from "@/lib/types/events";
export const EventCard = ({event}: {event: Event}) => {
    const handleEllipsisClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: 이벤트 메뉴 표시 로직 추가
        console.log('이벤트 메뉴 표시', event.id);
    };
    return (
        <div className=" w-full h-full flex flex-col items-start">
            <div className="w-full relative">
                <Image
                    src={event.thumbnail.url}
                    alt="이벤트 이미지"
                    width={400} 
                    height={250}
                    className="w-full h-[250px] object-cover rounded-xl"
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
                <div className="flex-shrink-0">
                    <EllipsisVertical 
                    onClick={handleEllipsisClick} 
                    className="text-xl text-gray cursor-pointer" 
                    />
                </div>
            </div>
            <div className="text-sm text-gray line-clamp-2">
                {event.description}
            </div>
            
        </div>
    );
};