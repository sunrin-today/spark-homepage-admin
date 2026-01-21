"use client";
import { SearchBar } from "@/components/common/search/SearchBar";
import { useEffect, useState } from "react";
import { EventCard } from "@/components/events/EventCard";
import { Plus } from "lucide-react";
import { Event } from "@/lib/types/events";
import eventsApi from "@/lib/api/events";
import Link from "next/link";
import PageHeader from "@/components/layout/page/PageHeader";
import { useEvents } from "@/lib/queries/events/queries";
import Pagination from "@/components/common/pagination/Pagination";
import { usePaginationQuery } from "@/lib/hooks/usePaginationQuery";

export default function EventsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");   // 실제 fetch용
  const [limit, setLimit] = useState(6);
  const { page: paginationPage, setPage: setPaginationPage } = usePaginationQuery("page", 1);
  const { data: events, isLoading, error } = useEvents({ page: paginationPage, limit, search: searchQuery });
  
  return (
    <div className="px-8 py-12 flex-col flex gap-[10px] mx-auto max-w-[1440px]"> {/*TODO: Page Container 컴포넌트로 변환*/}
        <PageHeader title="이벤트 목록" /> 
        <div className="flex flex-col gap-6 px-2 py-3">
            
            <SearchBar 
                value={searchValue}
                placeholder="검색어를 입력하세요"
                onChangeText={setSearchValue}
                onSubmit={() => {
                    setSearchQuery(searchValue);
                }}
            />
            <div className="flex flex-col gap-3">
                
                <div className="flex justify-end">
                    <Link href="/events/add" className="bg-black text-white text-base p-3 rounded-2xl flex w-fit items-center gap-2">
                        <Plus className="pr-1" />등록하기
                    </Link>
                </div>
                {   
                    error ? (
                        <div className="text-center py-8">
                            <p className="text-error">오류가 발생했습니다.</p>
                            <p className="text-error">{error.message}</p>
                        </div>
                    ) : isLoading ? (
                        <div className="text-center py-8">
                            <p className="text-gray">로딩 중...</p>
                        </div>
                    ) : events?.items && events.items.length > 0 ? (
                        <>
                        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {events.items.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                        <Pagination
                            currentPage={paginationPage}
                            totalPages={events.totalPages}
                            totalItems={events.total}
                            onPageChange={(page) => setPaginationPage(page)}
                        />
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">이벤트가 없습니다.</p>
                        </div>
                    )
                }
            </div>
        </div>
    </div>
  );
}