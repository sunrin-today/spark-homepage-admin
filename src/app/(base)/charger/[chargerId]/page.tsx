"use client"
import PageHeader from "@/components/layout/page/PageHeader";
import { InfoColumn } from "@/components/ui/InfoCol";
import { useParams } from "next/navigation";
import { useGetCharger } from "@/lib/queries/charger/queries";
import { DataTable } from "@/components/common/table/DataTable";
import { Column } from "@/lib/types/table";
import { ChargerRentalRecord } from "@/lib/types/charger";
import { useTableSort } from "@/lib/hooks/useTableSort";
import ActionBarTrigger from "@/components/common/action/ActionBarTrigger";

export default function ChargerDetailPage() {
    const { chargerId } = useParams<{ chargerId: string }>();
    const { data : chargerData, isLoading, error, refetch } = useGetCharger(chargerId);
    const {sort, onSortChange} = useTableSort({key: "borrower", order: "ASC"})

    const chargerColumn : Column<ChargerRentalRecord>[] = [
        {
            header: "#",
            render: (_, index) => index + 1,
            width: '40px'
        },
        {
            sortKey: "borrower",
            isSortable: true,
            header: "이름",
            width: '270px',
            render: (row) => row.borrower.name,
        },
        {
            sortKey: "reviwer",
            isSortable: true,
            header: "관리자",
            width: '280px',
            render: (row) => row.reviewer?.name ?? "",
        },
        {
            sortKey: "createdAt",
            isSortable: true,
            header: "대여 날짜",
            width: "168px",
            render: (row) => row.createdAt,
        },
        {
            sortKey: "deadline",
            isSortable: true,
            header: "반납 날짜",
            width: "154px",
            render: (row) => row.deadline,
        },
        
        {
            header: "액션",
            width: "100px",
            render: (row) => (
                <button>
                    반납
                </button>
            )
        }
    ]
    return (
        <div className="px-8 py-12 flex flex-col gap-[10px]">
            <PageHeader title={chargerData?.chargerId + "번 충전기"} isBackButton/>
            <InfoColumn
                label="상태"
                value={
                    <span>
                        {chargerData?.status === "not_rented" ? "미대여" 
                        : chargerData?.status === "renting" ? "대여중" 
                        : "전달예정"}
                        <ActionBarTrigger
                            title="상태 변경"
                            actionButton={<button className="px-[10px] py-[5px] text-[10px] bg-lightgray text-[#0D0D0D] rounded-[5px]">상태 변경</button>}
                            items={[
                                {
                                        label: "반납",
                                        onClick: () => {},
                                        icon: <></>,
                                        hoverBackgroundColor: "#EEEEEE",
                                        backgroundColor: "#F9F9F9",
                                    },
                                ]}      
                        />
                    </span>
                }
            />
                
            <div className="flex flex-col px-3 gap-3">  
                <DataTable
                    tableHeader = {
                        <span className="text-sm text-darkgray">대여기록</span>
                    }
                    columns={chargerColumn}
                    data={chargerData?.rentalRecords || []}
                    sort={sort}
                    onSortChange={onSortChange}
                    onRefresh={refetch}
                />
            </div>
        </div>
    );
};