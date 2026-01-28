"use client"
import PageHeader from "@/components/layout/page/PageHeader";
import { InfoColumn } from "@/components/ui/InfoCol";
import { useParams } from "next/navigation";
import { useGetChargerByChargerId } from "@/lib/queries/charger/queries";
import { DataTable } from "@/components/common/table/DataTable";
import { Column } from "@/lib/types/table";
import { ChargerRentalRecord } from "@/lib/types/charger";
import { useTableSort } from "@/lib/hooks/useTableSort";
import ActionBarTrigger from "@/components/common/action/ActionBarTrigger";
import { useModal } from "@/contexts/ModalContexts";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";
import { useRentCharger, useReturnCharger } from "@/lib/queries/charger/mutations";
import { UserLink } from "@/components/user/UserLink";
import { ChargerRequestModal } from "@/components/charger/ChargerRequestModal";
import { ChargerStatusBadge } from "@/components/charger/StatusBadge";
import { getChargerRentalRecordByCharger } from "@/lib/queries/charger-record/queries";
import { formatKoreanDate } from "@/utils/date";
export default function ChargerDetailPage() {
    const { chargerId } = useParams<{ chargerId: string }>();
    const { data : chargerData, isLoading, error, refetch } = useGetChargerByChargerId(chargerId);
    const { data : rentalRecords, isLoading: isLoadingRentalRecords, error: rentalRequestError, refetch: rentalRequestRefresh } = getChargerRentalRecordByCharger(chargerId);
    const {sort, onSortChange} = useTableSort({key: "borrower", order: "ASC"})
    const {open, close} = useModal();
    const {mutate: returnCharger} = useReturnCharger();
    const {mutate: rentCharger} = useRentCharger();
    
    const chargerColumn : Column<ChargerRentalRecord>[] = [
        {
            header: "#",
            render: (_, index) => <span className="text-gray font-medium">{index + 1}</span>,
            width: '40px'
        },
        {
            sortKey: "borrower",
            isSortable: true,
            header: "이름",
            width: '270px',
            render: (row) => <UserLink user={row.borrower}/>,
        },
        {
            sortKey: "reviwer",
            isSortable: true,
            header: "관리자",
            width: '280px',
            render: (row) => row.reviewer ? <UserLink user={row.reviewer}/>: "",
        },
        {
            sortKey: "createdAt",
            isSortable: true,
            header: "대여 날짜",
            width: "168px",
            render: (row) => formatKoreanDate(row.createdAt),
        },
        {
            sortKey: "deadline",
            isSortable: true,
            header: "반납 날짜",
            width: "154px",
            render: (row) => formatKoreanDate(row.deadline),
        },
    ]
    return (
        <div className="px-8 py-12 flex flex-col gap-[10px]">
            <PageHeader title={(chargerData?.chargerId || "") + "번 충전기"} isBackButton/>
            <InfoColumn
                label="상태"
                value={
                    <div className="flex items-center gap-[10px]">
                        <ChargerStatusBadge status={chargerData?.status || "not_rented"} />
                        {chargerData?.status === "renting" || chargerData?.status === "waiting" ? (
                            <p>
                            <UserLink
                                user={chargerData?.currentRentalRecord?.borrower}
                            />
                            </p>
                        ) : null}
                        <ActionBarTrigger
                            title="상태 변경"
                            actionButton={
                                        <button
                                            className="px-[10px] leading-normal py-[5px] text-[10px] bg-black text-[#FAFAFA] rounded-[5px]">상태 변경</button>}
                            items={[
                                ...(chargerData?.status === "not_rented" ? [{
                                    label: "전달예정",
                                    onClick: () => {
                                        open(
                                            <ChargerRequestModal
                                                id={chargerData?.id || ""}
                                                chargerId={chargerData?.chargerId || ""}
                                                onClose={() => close()}
                                            />
                                        )
                                    },
                                    icon: <></>,
                                    hoverBackgroundColor: "#EEEEEE",
                                    backgroundColor: "#F9F9F9",
                                }
                                    ] : []),
                                ...(chargerData?.status === "renting" ? [{
                                    label: "반납완료(미대여)",
                                    onClick: () => {
                                        open(
                                            <ConfirmModal
                                                onClose={() => close()}
                                                onConfirm={() => {
                                                    returnCharger(
                                                        chargerData?.id || 0
                                                    );
                                                    close();
                                                }}
                                            />
                                        )
                                    },
                                    icon: <></>,
                                    hoverBackgroundColor: "#EEEEEE",
                                    backgroundColor: "#F9F9F9",
                                }] : []),
                                ...(chargerData?.status === "waiting" ? [{
                                    label: "전달완료(대여중)",
                                    onClick: () => {
                                        open(
                                            <ConfirmModal
                                                onClose={() => close()}
                                                onConfirm={() => {
                                                    rentCharger(
                                                        chargerData?.id || 0
                                                    );
                                                    close();
                                                }}
                                            />
                                        )
                                    },
                                    icon: <></>,
                                    hoverBackgroundColor: "#EEEEEE",
                                    backgroundColor: "#F9F9F9",
                                },
                                {
                                    label: "미대여",
                                    onClick: () => {
                                        open(
                                            <ConfirmModal
                                                onClose={() => close()}
                                                onConfirm={() => {
                                                    returnCharger(
                                                        chargerData?.id || 0
                                                    );
                                                    close();
                                                }}
                                            />
                                        )
                                    },
                                    icon: <></>,
                                    hoverBackgroundColor: "#EEEEEE",
                                    backgroundColor: "#F9F9F9",
                                }] : [])
                            ]}   
                            
                        />
                    </div>
                }
            />
                
            <div className="flex flex-col px-3 gap-3">
                <DataTable
                    tableHeader = {
                        <span className="text-sm text-darkgray">대여기록</span>
                    }
                    columns={chargerColumn}
                    data={rentalRecords?.data.items || []}
                    sort={sort}
                    onSortChange={onSortChange}
                    onRefresh={rentalRequestRefresh}
                />
            </div>
        </div>
    );
};