"use client";

import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, RefreshCw } from "lucide-react";
import { DataTable } from "@/components/common/table/DataTable";
import Pagination from "@/components/common/pagination/Pagination";
import { useTableSort } from "@/lib/hooks/useTableSort";
import { usePaginationQuery } from "@/lib/hooks/usePaginationQuery";
import { Column } from "@/lib/types/table";
import { ChargerRentalRecord } from "@/lib/types/charger";
import { Lost } from "@/lib/types/losts";
import { useQuery } from "@tanstack/react-query";
import chargerApi from "@/lib/api/charger";
import lostsApi from "@/lib/api/losts";
import Toggle from "@/components/ui/input/Toggle";
import Image from "next/image";

const ITEMS_PER_PAGE = 5;

const UserDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = params.userId as string;

  // url 파라미터에서 사용자 정보 가져옴
  const userName = searchParams.get("name") || "사용자";
  const userEmail = searchParams.get("email") || "";
  const userRole = (searchParams.get("role") || "USER") as "USER" | "ADMIN";
  const userAvatarUrl = searchParams.get("avatarUrl");

  const { page: chargerPage, setPage: setChargerPage } = usePaginationQuery("chargerPage", 1);
  const { page: lostPage, setPage: setLostPage } = usePaginationQuery("lostPage", 1);
  
  const { sort: chargerSort, onSortChange: onChargerSortChange } = useTableSort({
    key: "chargerId",
    order: "ASC",
  });
  
  const { sort: lostSort, onSortChange: onLostSortChange } = useTableSort({
    key: "title",
    order: "ASC",
  });

  const { data: chargerData, isLoading: isChargerLoading, refetch: refetchCharger } = useQuery({
    queryKey: ["rental-records", userId, chargerPage, chargerSort],
    queryFn: () =>
      chargerApi.getUserRentalRecords(userId, {
        page: chargerPage,
        limit: ITEMS_PER_PAGE,
        column: chargerSort.key,
        orderDirection: chargerSort.order,
      }),
    retry: false,
  });

  const { data: lostData, isLoading: isLostLoading, refetch: refetchLost } = useQuery({
    queryKey: ["collected-losts", userId, lostPage, lostSort],
    queryFn: () =>
      lostsApi.getUserCollectedLosts(userId, {
        page: lostPage,
        limit: ITEMS_PER_PAGE,
        column: lostSort.key,
        orderDirection: lostSort.order,
      }),
    retry: false,
  });

  const chargerColumns: Column<ChargerRentalRecord>[] = [
    {
      header: "#",
      width: "60px",
      render: (_, index) => {
        const itemNumber = (chargerPage - 1) * ITEMS_PER_PAGE + index + 1;
        return <span>{itemNumber}</span>;
      },
    },
    {
      header: "충전기 번호",
      sortKey: "chargerId",
      isSortable: true,
      width: "150px",
      render: (record) => <span>{record.chargerId}번 충전기</span>,
    },
    {
      header: "반납 여부",
      sortKey: "isReturned",
      isSortable: true,
      width: "150px",
      render: (record) => (
        <Toggle
          checked={record.isReturned}
          onChange={() => {}}
          disabled={true}
          size="md"
        />
      ),
    },
    {
      header: "반납 기한",
      sortKey: "deadline",
      isSortable: true,
      width: "200px",
      render: (record) => {
        const date = new Date(record.deadline);
        return <span>{date.getFullYear()}년 {date.getMonth() + 1}월 {date.getDate()}일</span>;
      },
    },
    {
      header: "액션",
      width: "80px",
      render: () => <span>...</span>,
    },
  ];

  const lostColumns: Column<Lost>[] = [
    {
      header: "#",
      width: "60px",
      render: (_, index) => {
        const itemNumber = (lostPage - 1) * ITEMS_PER_PAGE + index + 1;
        return <span>{itemNumber}</span>;
      },
    },
    {
      header: "물건 이름",
      sortKey: "title",
      isSortable: true,
      width: "200px",
      render: (lost) => <span>{lost.title}</span>,
    },
    {
      header: "습득 위치",
      sortKey: "location",
      isSortable: true,
      width: "250px",
      render: (lost) => <span>{lost.location}</span>,
    },
    {
      header: "액션",
      width: "80px",
      render: () => <span>...</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">사용자 상세</h1>
      </div>

      <div className="flex items-center gap-4">
        {userAvatarUrl ? (
          <div className="w-20 h-20 rounded-full overflow-hidden relative">
            <Image
              src={userAvatarUrl}
              alt={userName}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
            <span className="text-xl text-white font-semibold">
              {userName.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{userName}</h2>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                userRole === "ADMIN"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {userRole === "ADMIN" ? "관리자" : "학생"}
            </span>
          </div>
          <p className="text-[#767676] mt-1">{userEmail}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isChargerLoading ? (
          <div className="flex items-center justify-center py-20 border border-[#D5D5D5] rounded-2xl">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        ) : chargerData?.items && chargerData.items.length > 0 ? (
          <>
            <DataTable
              columns={chargerColumns}
              data={chargerData.items}
              sort={chargerSort}
              onSortChange={onChargerSortChange}
              onRefresh={() => refetchCharger()}
              isRefreshing={isChargerLoading}
              tableHeader={
                <h3 className="text-xl font-semibold">충전기 대여 기록</h3>
              }
            />
            <Pagination
              currentPage={chargerPage}
              totalPages={chargerData.totalPages}
              totalItems={chargerData.total}
              onPageChange={setChargerPage}
            />
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="w-full flex items-center justify-between">
              <h3 className="text-xl font-semibold">충전기 대여 기록</h3>
              <RefreshCw 
                className="w-6 h-6 p-1 text-gray cursor-pointer" 
                onClick={() => refetchCharger()}
              />
            </div>
            <div className="flex items-center justify-center py-20 border border-[#D5D5D5] rounded-2xl">
              <div className="text-gray-500">대여 기록이 없습니다.</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {isLostLoading ? (
          <div className="flex items-center justify-center py-20 border border-[#D5D5D5] rounded-2xl">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        ) : lostData?.items && lostData.items.length > 0 ? (
          <>
            <DataTable
              columns={lostColumns}
              data={lostData.items}
              sort={lostSort}
              onSortChange={onLostSortChange}
              onRefresh={() => refetchLost()}
              isRefreshing={isLostLoading}
              tableHeader={
                <h3 className="text-lg font-semibold">분실물 기록</h3>
              }
            />
            <Pagination
              currentPage={lostPage}
              totalPages={lostData.totalPages}
              totalItems={lostData.total}
              onPageChange={setLostPage}
            />
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="w-full flex items-center justify-between">
              <h3 className="text-lg font-semibold">분실물 기록</h3>
              <RefreshCw 
                className="w-6 h-6 p-1 text-gray cursor-pointer" 
                onClick={() => refetchLost()}
              />
            </div>
            <div className="flex items-center justify-center py-20 border border-[#D5D5D5] rounded-2xl">
              <div className="text-gray-500">분실물 기록이 없습니다.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailPage;