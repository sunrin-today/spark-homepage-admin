"use client";
import { SearchBar } from "@/components/common/search/SearchBar";
import PageHeader from "@/components/layout/page/PageHeader";
import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { usePaginationQuery } from "@/lib/hooks/usePaginationQuery";
import Pagination from "@/components/common/pagination/Pagination";
import { LostCard } from "@/components/losts/LostCard";
import { useLostListQuery } from "@/lib/queries/losts/queries";
export default function LostsPage() {
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [limit, setLimit] = useState(8);
    const { page: paginationPage, setPage: setPaginationPage } = usePaginationQuery("page", 1);
    const { data: losts, isLoading, error } = useLostListQuery({ page: paginationPage, limit, search: searchQuery });
    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setPaginationPage(1);
    };
    return (
        <div className="px-8 py-12 gap-[10px] flex flex-col mx-auto max-w-[1440px]">
            <PageHeader title="월간 분실물"/>
            <div className="flex flex-col gap-6 px-2 py-3">
                <SearchBar
                value={searchValue}
                onChangeText={setSearchValue}
                onSubmit={handleSearch}
                placeholder="검색어를 입력해주세요..."
                />
                 <div className="flex flex-col gap-3">
                
                <div className="flex justify-end">
                    <Link href="/losts/add" className="bg-black text-white text-base p-3 rounded-2xl flex w-fit items-center gap-2">
                        <Plus className="pr-1" />등록하기
                    </Link>
                </div>
                {   
                    error ? (
                        <div className="text-center py-8">
                            <p className="text-red">오류가 발생했습니다.</p>
                            <p className="text-gray">{error.message}</p>
                        </div>
                    ) : losts?.items && losts.items.length > 0 ? (
                        <>
                        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {losts.items.map((lost) => (
                                <LostCard key={lost.id} lost={lost} />
                            ))}
                        </div>
                        <Pagination
                            currentPage={paginationPage}
                            totalPages={losts.totalPages}
                            totalItems={losts.total}
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