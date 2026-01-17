"use client";
import { SearchBar } from "@/components/common/search/SearchBar";
import { useEffect, useState } from "react";
import { EventCard } from "@/components/events/EventCard";
import { Plus } from "lucide-react";
import { Event } from "@/lib/types/events";
import eventsApi from "@/lib/api/events";
import Link from "next/link";

export default function EventsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    eventsApi.getEvents().then((data) => {
      setEvents(data.items);
    });
  }, []);
  const handleSearch = (value: string) => {
    eventsApi.getEvents(1, 10, value).then((data) => {
      setEvents(data.items);
    });
    console.log(value);
  };
  return (
    <div className="px-8 py-12"> {/*TODO: Page Container 컴포넌트로 변환*/}
        <h1 className="text-xl font-bold pb-4">이벤트 목록</h1>  {/*TODO: Heading 컴포넌트로 변환 또는 Page Container 내부 요소로 전환*/}
            <SearchBar 
            value={searchValue}
            placeholder="검색어를 입력하세요"
            onChangeText={setSearchValue}
            onSubmit={handleSearch}
            />
        <div className="flex justify-end pb-3">
            {/*TODO: 버튼 컴포넌트로 변환*/}
            <Link href="/events/add" className="bg-black text-white text-base p-3 rounded-2xl flex items-center gap-2">
                <Plus className="pr-1" />등록하기
            </Link>
        </div>
        {   events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">이벤트가 없습니다.</p>
                </div>
            )
        }
        {/*TODO: 페이지네이션 컴포넌트 추가*/}
    </div>
  );
}