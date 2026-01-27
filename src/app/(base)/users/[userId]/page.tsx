"use client";

import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, RefreshCw } from "lucide-react";
import { DataTable } from "@/components/common/table/DataTable";
import Pagination from "@/components/common/pagination/Pagination";
import { useTableSort } from "@/lib/hooks/useTableSort";
import { usePaginationQuery } from "@/lib/hooks/usePaginationQuery";
import { Column } from "@/lib/types/table";
import { ChargerRentalRecord } from "@/lib/types/charger";
import { Lost } from "@/lib/types/losts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import chargerApi from "@/lib/api/charger";
import lostsApi from "@/lib/api/losts";
import Toggle from "@/components/ui/input/Toggle";
import Image from "next/image";
import api from "@/lib/api/api";
import { useModal } from "@/contexts/ModalContexts";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";

const ITEMS_PER_PAGE = 5;

const UserDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = params.userId as string;
  const queryClient = useQueryClient();
  const { open, close } = useModal();

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

  const toggleReturnMutation = useMutation({
    mutationFn: async ({ recordId, currentStatus }: { recordId: string; currentStatus: boolean }) => {
      // 이미 반납된 경우 토글할 수 없음
      if (currentStatus) {
        throw new Error("이미 반납된 충전기는 취소할 수 없습니다.");
      }
      const response = await api.patch(`/api/rental-record/${recordId}/returned`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rental-records", userId] });
      refetchCharger();
      close();
    },
    onError: (error: any) => {
      alert(error.message || "반납 상태 변경에 실패했습니다.");
      close();
    }
  });

  const handleToggleChange = (recordId: string, currentStatus: boolean) => {
    if (currentStatus) {
      alert("이미 반납된 충전기는 취소할 수 없습니다.");
      return;
    }

    open(
      <ConfirmModal
        title="반납 상태 변경"
        message="상태를 반납 완료로 변경하시겠습니까? 이후에는 반납 상태를 변경할 수 없습니다."
        onClose={() => close()}
        onConfirm={() => {
          toggleReturnMutation.mutate({ 
            recordId, 
            currentStatus 
          });
        }}
      />
    );
  };

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
      render: (record) => <span className="whitespace-nowrap">{record.chargerId}번 충전기</span>,
    },
    {
      header: "반납 여부",
      sortKey: "isReturned",
      isSortable: true,
      width: "150px",
      render: (record) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Toggle
            checked={record.isReturned}
            onChange={() => handleToggleChange(record.id, record.isReturned)}
            disabled={toggleReturnMutation.isPending || record.isReturned}
            size="md"
          />
        </div>
      ),
    },
    {
      header: "반납 기한",
      sortKey: "deadline",
      isSortable: true,
      width: "200px",
      render: (record) => {
        const date = new Date(record.deadline);
        return <span className="whitespace-nowrap">{date.getFullYear()}년 {date.getMonth() + 1}월 {date.getDate()}일</span>;
      },
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
      render: (lost) => <span className="truncate block">{lost.title}</span>,
    },
    {
      header: "습득 위치",
      sortKey: "location",
      isSortable: true,
      width: "250px",
      render: (lost) => <span className="truncate block">{lost.location}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-8 pt-20 lg:pt-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg sm:text-xl font-semibold">사용자 상세</h1>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {userAvatarUrl ? (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden relative flex-shrink-0">
            <Image
              src={userAvatarUrl}
              alt={userName}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
            <span className="text-xl sm:text-2xl text-white font-semibold">
              {userName.charAt(0)}
            </span>
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg sm:text-xl font-semibold break-words">{userName}</h2>
            <span
              className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm whitespace-nowrap ${
                userRole === "ADMIN" ? "text-[#ffb22d]" : "text-[#34B83D]"
              }`}
              style={{
                backgroundColor: userRole === "ADMIN" 
                  ? "rgba(255, 178, 45, 0.2)" 
                  : "rgba(52, 184, 61, 0.2)"
              }}
            >
              {userRole === "ADMIN" ? "관리자" : "학생"}
            </span>
          </div>
          <p className="text-[#767676] mt-1 text-sm sm:text-base break-all">{userEmail}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {chargerData?.items && chargerData.items.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                <DataTable
                  columns={chargerColumns}
                  data={chargerData.items}
                  sort={chargerSort}
                  onSortChange={onChargerSortChange}
                  onRefresh={() => refetchCharger()}
                  isRefreshing={isChargerLoading}
                  tableHeader={
                    <h3 className="text-lg sm:text-xl font-semibold">충전기 대여 기록</h3>
                  }
                />
              </div>
            </div>
            <div className="px-4 sm:px-0">
              <Pagination
                currentPage={chargerPage}
                totalPages={chargerData.totalPages}
                totalItems={chargerData.total}
                onPageChange={setChargerPage}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="w-full flex items-center justify-between px-4 sm:px-0">
              <h3 className="text-lg sm:text-xl font-semibold">충전기 대여 기록</h3>
              <RefreshCw 
                className="w-6 h-6 p-1 text-gray cursor-pointer" 
                onClick={() => refetchCharger()}
              />
            </div>
            <div className="flex items-center justify-center py-20 border border-[#D5D5D5] rounded-2xl mx-4 sm:mx-0">
              <div className="text-gray-500 text-sm sm:text-base">대여 기록이 없습니다.</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {lostData?.items && lostData.items.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <DataTable
                  columns={lostColumns}
                  data={lostData.items}
                  sort={lostSort}
                  onSortChange={onLostSortChange}
                  onRefresh={() => refetchLost()}
                  isRefreshing={isLostLoading}
                  tableHeader={
                    <h3 className="text-lg sm:text-xl font-semibold">분실물 기록</h3>
                  }
                />
              </div>
            </div>
            <div className="px-4 sm:px-0">
              <Pagination
                currentPage={lostPage}
                totalPages={lostData.totalPages}
                totalItems={lostData.total}
                onPageChange={setLostPage}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="w-full flex items-center justify-between px-4 sm:px-0">
              <h3 className="text-lg sm:text-xl font-semibold">분실물 기록</h3>
              <RefreshCw 
                className="w-6 h-6 p-1 text-gray cursor-pointer" 
                onClick={() => refetchLost()}
              />
            </div>
            <div className="flex items-center justify-center py-20 border border-[#D5D5D5] rounded-2xl mx-4 sm:mx-0">
              <div className="text-gray-500 text-sm sm:text-base">분실물 기록이 없습니다.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailPage;