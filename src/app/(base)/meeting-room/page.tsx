"use client";
import { SearchBar } from "@/components/common/search/SearchBar";
import { DataTable } from "@/components/common/table/DataTable";
import { useEffect, useState } from "react";
import { Column } from "@/lib/types/table";
import { RoomRental } from "@/lib/types/meeting-room";
import PageHeader from "@/components/layout/page/PageHeader";
import { formatKoreanDate } from "@/utils/date";
import Link from "next/link";
import { EllipsisVertical } from "lucide-react";
import { useTableSort } from "@/lib/hooks/useTableSort";

export default function MeetingRoomPage() {
  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const { sort, onSortChange } = useTableSort({ key: "submitDate", order: "asc" });
  const columns: Column<RoomRental>[] = [
  {
    header: "#",
    width: "40px",
    render: (_, index) => <span className="text-gray font-medium">{(page - 1) * limit + index + 1}</span>,
  },
  {
    header: "이름",
    width: "200px",
    render: (row) => (
      <Link href={`/users/${row.id}`} className="text-t underline">
        {row.userName}
      </Link>
    ),
    isSortable: true,
    sortKey: "userName",
  },
  {
    header: "사용 목적",
    width: "380px",
    render: (row) => row.purpose,
    isSortable: true,
    sortKey: "purpose",
  },
  {
    header: "대여 희망 날짜",
    width: "189px",
    render: (row) => formatKoreanDate(row.date),
    isSortable: true,
    sortKey: "wantedDate",
  },
  {
    header: "신청서 제출 날짜",
    width: "154px",
    render: (row) => formatKoreanDate(row.submitDate),
    isSortable: true,
    sortKey: "submitDate",
  },
  {
    header: "액션",
    width: "100px",
    render: (row) => (
      <EllipsisVertical className="text-sm w-5 h-5 text-gray cursor-pointer" />
    ),
  },
];
  useEffect(() => {
    console.log(sort);
  }, [sort]);
  return (
    <div className="px-8 py-12">
      <PageHeader title="소회의실 대여"/>
      <SearchBar 
        value={searchValue}
        placeholder="검색어를 입력하세요"
        onChangeText={setSearchValue}
        onSubmit={setSearchQuery}
      />
    <DataTable
    columns={columns}
    data={[
        {
            id: 1,
            userName: "홍길동",
            purpose: "회의",
            date: "2025-10-20",
            submitDate: "2025-10-20",
        },
        {
            id: 1,
            userName: "홍길동",
            purpose: "회의",
            date: "2025-10-20",
            submitDate: "2025-10-20",
        },
        {
            id: 1,
            userName: "홍길동",
            purpose: "회의",
            date: "2025-10-20",
            submitDate: "2025-10-20",
        },
        {
            id: 2,
            userName: "홍길동",
            purpose: "회fffffdddddddsssssssssssss회의",
            date: "2025-10-20",
            submitDate: "2025-10-20",
        },
        {
            id: 3,
            userName: "홍길동",
            purpose: "회의",
            date: "2025-10-20",
            submitDate: "2025-10-20",
        },
        {
            id: 4,
            userName: "홍길동",
            purpose: "회의",
            date: "2025-10-20",
            submitDate: "2025-10-20",
        },
        {
            id: 5,
            userName: "홍길동",
            purpose: "회의",
            date: "2025-10-20",
            submitDate: "2025-10-20",
        }
    ]}
    sort={sort}
    onSortChange={onSortChange}
    />
    </div>
  );
}