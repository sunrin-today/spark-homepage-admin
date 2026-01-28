"use client"
import PageHeader from "@/components/layout/page/PageHeader";
import { useState } from "react";
import { usePaginationQuery } from "@/lib/hooks/usePaginationQuery";
import { Column } from "@/lib/types/table";
import { DataTable } from "@/components/common/table/DataTable";
import { Charger, ChargerRentalRequest } from "@/lib/types/charger";
import { formatKoreanDate } from "@/utils/date";
import Link from "next/link";
import ActionBarTrigger from "@/components/common/action/ActionBarTrigger";
import { Trash2 } from "lucide-react";
import Pagination from "@/components/common/pagination/Pagination";
import { useGetChargers } from "@/lib/queries/charger/queries";
import { useTableSort } from "@/lib/hooks/useTableSort";
import { UserLink } from "@/components/user/UserLink";
import { useModal } from "@/contexts/ModalContexts";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";
import { useChargerRequests } from "@/lib/queries/charger-request/queries";
import { ChargerStatusBadge } from "@/components/charger/StatusBadge";
import { useDeleteChargerRequest } from "@/lib/queries/charger-request/mutations";
import { useDeleteCharger } from "@/lib/queries/charger/mutations";
export default function ChargerPage() {
    
    const [activeTab, setActiveTab] = useState<"충전기 관리" | "신청서 관리">("충전기 관리");
    const {page: requestPage, setPage: setRequestPage} = usePaginationQuery("page", 1);
    const { sort: requestSort, onSortChange: onRequestSortChange } = useTableSort({ key: "createdAt", order: "DESC" })    
    const { sort, onSortChange } = useTableSort({ key: "chargerId", order: "ASC" })    
    const [requestLimit, setRequestLimit] = useState<number>(5);
    const { mutate: deleteCharger    } = useDeleteCharger()
    const {mutate: deleteChargerRequest    } = useDeleteChargerRequest()
    const {data: chargers, error, refetch: chargerRefresh} = useGetChargers({page:1, limit: 30, column: sort.key, orderDirection: sort.order}, activeTab === "충전기 관리");
    const { data: rentalRequests, refetch: rentalRequestRefresh } = useChargerRequests({page: requestPage, limit: requestLimit, column: requestSort.key, orderDirection: requestSort.order}, activeTab === "신청서 관리");
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
        render: (row) => <ChargerStatusBadge status={row.status}/>,
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
                hoverBackgroundColor: 'rgba(250, 83, 83, 0.2)',
                backgroundColor: '#F9F9F9',
                iconColor: '#FA5353',
                textColor: '#FA5353',
                onClick: () => 
                 {
                    open(<ConfirmModal
                        title={row.chargerId + "번 충전기 삭제"}
                        message={row.chargerId + "번 충전기를 삭제하시겠습니까?"}
                         onClose={() => close()} 
                         onConfirm={() =>{
                            deleteCharger(row.id);
                            close();
                        }}
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
            render: (_, index) => <span className="text-gray font-medium">{(requestPage - 1) * requestLimit + index + 1}</span>,
        },  
        {
            header: "이름",
            width: "550px",
            isSortable: true,
            sortKey: "user",
            render: (row) => <UserLink user={row.user}/>,
        },
        {
            header: "대여 신청 날짜",
            width: "326px",
            isSortable: true,
            sortKey: "createdAt",
            render: (row) => formatKoreanDate(row.createdAt)
        },
        {
            header: "액션",
            width: "106px",
            render: (row) => (
            <ActionBarTrigger
                items={[{
                icon: <Trash2 size={24} />,
                label: '삭제',
                hoverBackgroundColor: 'rgba(250, 83, 83, 0.2)',
                backgroundColor: '#F9F9F9',
                iconColor: '#FA5353',
                textColor: '#FA5353',
                onClick: () => 
                 {
                    open(<ConfirmModal
                        title="신청서 삭제"
                        message="신청서를 삭제하시겠습니까?"
                         onClose={() => close()} 
                         onConfirm={() => {
                            deleteChargerRequest(row.id);
                            close();
                        }}
                    />); 
                 }            
                }]}
                />
            )
            }
        ]
    return (
        <div className="px-8 py-12 flex flex-col gap-[32px]">
            <PageHeader title={"충전기 대여 - " + activeTab}/>
            <div className="px-2">
                {!error && (
                    <> 
                        {activeTab === "충전기 관리" && (
                            <DataTable
                                columns={columnCharger}
                                data={chargers?.items || []} 
                                onRefresh={() => chargerRefresh()}
                                sort={sort}
                                onSortChange={onSortChange}
                                tableHeader={
                                    <div className="flex gap-[10px]">
                                        <button
                                            onClick={() => setActiveTab("충전기 관리")}
                                            className="px-[16px] py-[12px] text-sm leading-[17px] font-medium bg-black text-[#FAFAFA] rounded-[8px]">충전기 관리</button>
                                        <button 
                                            onClick={() => setActiveTab("신청서 관리")}
                                            className="px-[16px] py-[12px] text-sm leading-[17px]  bg-lightgray font-medium text-black rounded-[8px]">신청서 관리</button>
                                    </div>
                                }
                            />
                        )}
                        {activeTab === "신청서 관리" && (
                        
                        <>
                        <DataTable
                            columns={columnRentalRequest}
                            data={rentalRequests?.items || []} 
                            onRefresh={() => rentalRequestRefresh()}
                            sort={requestSort}
                            onSortChange={onRequestSortChange}
                            tableHeader={
                                <div className="flex gap-[10px]">
                                    <button
                                        onClick={() => setActiveTab("충전기 관리")}
                                        className="px-[16px] py-[12px] text-sm bg-black font-medium leading-[17px] text-[#FAFAFA] rounded-[8px]">충전기 관리</button>
                                    <button 
                                        onClick={() => setActiveTab("신청서 관리")}
                                        className="px-[16px] py-[12px] text-sm bg-lightgray leading-[17px] font-medium text-black rounded-[8px]">신청서 관리</button>
                                </div>
                            }
                        />
                        
                        <Pagination
                            currentPage={requestPage}
                            totalPages={rentalRequests?.totalPages || 1}
                            totalItems={rentalRequests?.total || 100}
                            onPageChange={setRequestPage}
                        />
                        </>
                        )}
                    </>
                )}
                
            </div>
        </div>
    );
}