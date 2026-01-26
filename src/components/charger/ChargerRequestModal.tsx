    import { Modal } from "../ui/modal/Modal";
    import { useState } from "react";
    import { DataTable } from "../common/table/DataTable";
    import { useChargerRequests } from "@/lib/queries/charger-request/queries";
    import { ChevronLeft } from "lucide-react";
    import { Column } from "@/lib/types/table";
    import { ChargerRentalRequest } from "@/lib/types/charger";
    import { useTableSort } from "@/lib/hooks/useTableSort";
    import { formatKoreanDate } from "@/utils/date";
    import { UserLink } from "@/components/user/UserLink";
    import  ActionBarTrigger  from "@/components/common/action/ActionBarTrigger";
    import { Trash2 } from "lucide-react";
    import ConfirmModal from "@/components/ui/modal/ConfirmModal";
    import Pagination from "../common/pagination/Pagination";
import { useModal } from "@/contexts/ModalContexts";
    export const ChargerRequestModal = ({onClose}: {onClose: () => void}) => {    
        const [page, setPage] = useState(1);
        const [selectedRequest, setSelectedRequest] = useState<ChargerRentalRequest | null>(null);
        const { open, close} = useModal()
        const {sort, onSortChange } = useTableSort({key: "createdAt", order: "DESC"})
        const { data: chargerRequests, isLoading, error } = useChargerRequests({page, limit: 10, column: sort.key, orderDirection: sort.order}, true);
        const columnRentalRequest: Column<ChargerRentalRequest>[] = [
            {
                header: "#",
                width: "40px",
                render: (_, index) => <span className="text-gray font-medium">{(page - 1) *  + index + 1}</span>,
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
                    backgroundColor: 'rgba(250, 83, 83, 0.2)',
                    iconColor: '#FA5353',
                    textColor: '#FA5353',
                    onClick: () => 
                    {
                        open(<ConfirmModal
                            title={"충전기 대여 요청을 삭제하시겠습니까?"}
                            message="삭제한 이후에는 되돌릴 수 없습니다."
                            onClose={() => close()} 
                            onConfirm={() =>
                            close()
                            }
                        />); 
                    }            
                    }]}
                    />
                )
                }
            ]
        return (
            <Modal className="gap-5 p-6 rounded-[20px]" isOpen={true} onClose={onClose}>
                    <div className="flex gap-3">
                        <ChevronLeft />
                        <h2 className="text-[#000000] text-2xl font-semibold">대여 유저 선택하기</h2>
                    </div>
                    <div className="flex flex-col px-2 gap-2">
                        {isLoading && <div>로딩 중...</div>}
                        {error && <div className="text-error">오류가 발생했습니다.</div>}
                        {
                            !isLoading && !error && (
                                <>
                                <DataTable
                                    data={chargerRequests?.items || []}
                                    sort={sort}
                                    onSortChange={onSortChange}
                                    columns={columnRentalRequest}
                                    onRowClick={(row) => setSelectedRequest(row)}
                                    selectedRow={selectedRequest ?? undefined}
                                />
                                <Pagination
                                    totalItems={chargerRequests?.total || 0}
                                    totalPages={chargerRequests?.totalPages || 0}
                                    currentPage={page}
                                    onPageChange={setPage}
                                />
                                </>
                            )
                        }
                    </div>
                    <div className="w-full flex justify-end">
                        <button
                            disabled={!selectedRequest}
                            className="px-[22px] py-[10px] text-base text-white bg-[#0D0D0D] rounded-[100px]">선택완료</button>
                    </div>
            </Modal>
        );
    };