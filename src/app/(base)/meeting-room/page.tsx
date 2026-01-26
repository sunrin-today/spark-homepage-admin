"use client";
import { DataTable } from "@/components/common/table/DataTable";
import { useEffect, useState } from "react";
import { Column } from "@/lib/types/table";
import { RentalRecord } from "@/lib/types/meeting-room";
import PageHeader from "@/components/layout/page/PageHeader";
import { formatKoreanDate } from "@/utils/date";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useTableSort } from "@/lib/hooks/useTableSort";
import { usePaginationQuery } from "@/lib/hooks/usePaginationQuery";
import Pagination from "@/components/common/pagination/Pagination";
import { useMeetingRoomListQuery } from "@/lib/queries/meeting-room/queries";
import Image from "next/image";
import ActionBarTrigger from "@/components/common/action/ActionBarTrigger";
import { useDeleteRentalMutation } from "@/lib/queries/meeting-room/mutations";
import { UserLink } from "@/components/user/UserLink";
import { useModal } from "@/contexts/ModalContexts";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";
export default function MeetingRoomPage() {
  const [limit, setLimit] = useState<number>(10);
  const { page: paginationPage, setPage: setPaginationPage } = usePaginationQuery("page", 1);
  const { sort, onSortChange } = useTableSort({ key: "borrower", order: "ASC" });
  const {data: rentalRecords, isLoading: isloading, error: listError, refetch: refetchList} = useMeetingRoomListQuery({page: paginationPage, limit, column: sort.key, orderDirection: sort.order});
  const {mutate: deleteRental, isPending: isDeleting, error: deleteError} = useDeleteRentalMutation();
  const { open, close} = useModal()
  const columns: Column<RentalRecord>[] = [
    {
        header: "#",
        width: "40px",
        render: (_, index) => <span className="text-gray font-medium">{(paginationPage - 1) * limit + index + 1}</span>,
    },
    {
        header: "이름",
        width: "200px",
        render: (row) => (
            <UserLink user={row.borrower} />
        ),
        isSortable: true,
        sortKey: "borrower",
    },
    {
        header: "사용 목적",
        width: "380px",
        render: (row) => (
            <Link href={`/meeting-room/${row.id}`} >
                {row.purpose}
            </Link>
        ),
    },
    {
        header: "대여 희망 날짜",
        width: "189px",
        render: (row) => formatKoreanDate(row.wantedDate),
        isSortable: true,
        sortKey: "wantedDate",
    },
    {
        header: "신청서 제출 날짜",
        width: "154px",
        render: (row) => formatKoreanDate(row.createdAt),
        isSortable: true,
        sortKey: "createdAt",
    },
    {
        header: "액션",
        width: "47px",
        render: (row) => (
        <ActionBarTrigger 
            title="액션"
            items={[
            {
                icon: <Trash2 size={24} />,
                label: '삭제',
                backgroundColor: '#F9F9F9',
                hoverBackgroundColor: 'rgba(250, 83, 83, 0.2)',
                iconColor: '#FA5353',
                textColor: '#FA5353',
                onClick: () => open(
                    <ConfirmModal onConfirm={() => {deleteRental(row.id); close()}} onClose={() => close()} title="삭제 확인" message="정말로 삭제하시겠습니까?"/>
                )
            }
            ]}
        />
        ),
    },
    ];

  return (
    <div className="px-8 py-12">
        <PageHeader title="소회의실 대여"/>
        <div className="mt-[22px] flex flex-col gap-2">
            
            {listError && <p className="text-[#FA5353]">불러오기에 실패했습니다: {listError.message}</p>}
            {deleteError && <p className="text-[#FA5353]">삭제에 실패했습니다: {deleteError.message}</p>}
            {!isloading && !listError && !deleteError && (<>
            <DataTable
                onRefresh={refetchList}
                columns={columns}
                data={rentalRecords?.items || []}
                sort={sort}
                onSortChange={onSortChange}
            />
            <Pagination
                currentPage={paginationPage}
                totalPages={rentalRecords?.totalPages || 0}
                totalItems={rentalRecords?.total || 0}
                onPageChange={setPaginationPage}
            />
            </>)}
        </div>
    </div>
  );
}