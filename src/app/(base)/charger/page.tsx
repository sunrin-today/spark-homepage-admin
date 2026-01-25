"use client"
import PageHeader from "@/components/layout/page/PageHeader";
import { useEffect, useState } from "react";
import { usePaginationQuery } from "@/lib/hooks/usePaginationQuery";
import { Column } from "@/lib/types/table";
import { DataTable } from "@/components/common/table/DataTable";
import { Charger, ChargerRentalRequest } from "@/lib/types/charger";
import { formatKoreanDate } from "@/utils/date";
import Link from "next/link";
import ActionBarTrigger from "@/components/common/action/ActionBarTrigger";
import { Trash2 } from "lucide-react";
import { getChargerStatusText } from "@/utils/charger";
import Pagination from "@/components/common/pagination/Pagination";
import { useGetChargers } from "@/lib/queries/charger/queries";
import { useTableSort } from "@/lib/hooks/useTableSort";
import { UserLink } from "@/components/user/UserLink";
import { useModal } from "@/contexts/ModalContexts";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";
export default function ChargerPage() {
    const [activeTab, setActiveTab] = useState<"충전기 관리" | "신청서 관리">("충전기 관리");
    const {page: page, setPage} = usePaginationQuery("page", 1);
    
    const { sort, onSortChange } = useTableSort({ key: "chargerId", order: "ASC" })    
    const {data: chargers, isLoading, error, refetch: chargerRefresh} = useGetChargers({page, limit: 20, column: sort.key, orderDirection: sort.order}, activeTab === "충전기 관리");
    const {open, close} = useModal()
    const columnCharger: Column<Charger>[] = [
         {
        header: "#",
        width: "40px",
        render: (_, index) => <span className="text-gray font-medium">{index + 1}</span>,
    },
    {
        header: "이름",
        width: "167px",
        render: (row) => {
            return <Link href={`/charger/${row.chargerId}`} className="underline">{row.chargerId}번 충전기</Link>;
        },
        isSortable: true,
        sortKey: "chargerId",
    },
    {
        header: "부가 설명",
        width: "359px",
        render: row => row.description,
        isSortable: true,
        sortKey: "description",
    },
    {
        header: "대여자",
        width: "167px",
        render: (row) => {
            if (!row.currentRentalRecord?.borrower) return "";
            else return <UserLink user={row.currentRentalRecord.borrower}/>;
        },
        isSortable: true,
        sortKey: "currentRental",
    },
    {
        header: "상태",
        width: "154px",
        render: (row) => getChargerStatusText(row.status),
        isSortable: true,
        sortKey: "status",
    },
    {
        header: "액션",
        width: "100px",
        render: (row) => (
        <ActionBarTrigger 
            title="액션"
            items={[
            {
                icon: <Trash2 size={24} />,
                label: '삭제',
                backgroundColor: 'rgba(250, 83, 83, 0.2)',
                iconColor: '#FA5353',
                textColor: '#FA5353',
                onClick: () => 
                 {
                    open(<ConfirmModal
                    
                         onClose={() => close()} 
                         onConfirm={() =>
                        //대충 deleteItem 함수 호출
                        close()
                    }
                         />); 
                 }            
            }
            ]}
        />
        ),
    }
    ]
    const columnRentalRequest: Column<ChargerRentalRequest>[] = [
        {
            header: "#",
            width: "40px",
            render: (_, index) => (page - 1) *  + index + 1,
        },  
        {
            header: "이름",
            width: "550px",
            render: (row) => (
                <span>대여 요청</span>
        ),
        },
        {
            header: "대여 시각",
            width: "326px",
            render: (row) => formatKoreanDate(row.createdAt)
        },
        {
            header: "액션",
            width: "106px",
            render: (row) => {
                return (
                    <div>
                        <button>승인</button>
                        <button>거절</button>
                    </div>
                )
            }
        }
    ]
    return (
        <div className="px-8 py-12 flex flex-col gap-[10px]">
            <PageHeader title={"충전기 대여 - " + activeTab}/>
            <div className="px-2">
                {isLoading && <div>로딩중...</div>}
                {!error && !isLoading && (
                    <> 
                        <DataTable
                            columns={activeTab === "충전기 관리" ? columnCharger : columnRentalRequest }
                            data={ activeTab === "충전기 관리" ? chargers?.items || [] : []} 
                            onRefresh={activeTab === "충전기 관리" ? () => chargerRefresh() : () => {}}
                            onSortChange={activeTab === "충전기 관리" ? onSortChange : () => {}}
                            sort={activeTab === "충전기 관리" ? sort : { key: "createdAt", order: "DESC" }}
                            tableHeader={
                                <div className="flex gap-[10px]">
                                    <button
                                        onClick={() => setActiveTab("충전기 관리")}
                                        className="px-[10px] py-[5px] text-[10px] bg-[#010101] text-[#FAFAFA] rounded-[5px]">충전기 관리</button>
                                    <button 
                                        onClick={() => setActiveTab("신청서 관리")}
                                        className="px-[10px] py-[5px] text-[10px] bg-lightgray text-[#0D0D0D] rounded-[5px]">신청서 관리</button>
                                </div>
                            }
                            
                        />
                    </>
                )}
                {
                        activeTab === "신청서 관리" && (
                        <Pagination
                            currentPage={page}
                            totalPages={10}
                            totalItems={100}
                            onPageChange={setPage}
                        />
                        )
                    }
                
            </div>
        </div>
    );
}