"use client";
import { useState } from "react";
import ActionBarTrigger from "@/components/common/action/ActionBarTrigger";
import PageHeader from "@/components/layout/page/PageHeader";
import { ActionBarItem } from "@/components/common/action/ActionBar";
import { Trash2, Pencil, X } from "lucide-react";
import { InfoColumn } from "@/components/ui/InfoCol";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useLostDetailQuery } from "@/lib/queries/losts/queries";
import { useRouter } from "next/navigation";
import { useDeleteLostMutation } from "@/lib/queries/losts/mutations";
import { Modal, useModal } from "@/components/ui/modal";
import { DataTable } from "@/components/common/table/DataTable";
import { Column } from "@/lib/types/table";
import { LostClaim } from "@/lib/types/lostClaims";
import { useTableSort } from "@/lib/hooks/useTableSort";
import Link from "next/link";
import { formatKoreanDate } from "@/utils/date";
import { useLostClaimsQuery } from "@/lib/queries/lostsClaims/queries";
import { getClaimStatusText } from "@/utils/lostClaims";
import { useChangeLostClaimStatusMutation } from "@/lib/queries/lostsClaims/mutations";
export default function LostDetailPage() {
    const params = useParams();
    const lostId = params.lostId!.toString();
    const { openModal, isOpen , closeModal} = useModal();
    const { data: lostData, isLoading , error, refetch } = useLostDetailQuery(lostId);
    const { sort, onSortChange } = useTableSort({ key: "createdAt", order: "DESC" });
    const { mutate: deleteLost } = useDeleteLostMutation();
    const [processingClaim, setProcessingClaim] = useState<{id: string, status: string} | null>(null);
    const { data: lostClaims , isLoading: isClaimsLoading , error: claimsError } = useLostClaimsQuery({ lostId, column: sort.key, orderDirection: sort.order });
    const { mutate: updateClaimStatus , isPending: isUpdatingStatus , error: updateStatusError } = useChangeLostClaimStatusMutation();
    const router = useRouter();
    const handleStatusUpdateClick = (id: string, status: string) => {
        setProcessingClaim({ id, status });
        openModal();
    };

    const confirmStatusUpdate = () => {
        if (processingClaim) {
            updateClaimStatus(processingClaim);
            closeModal();
        }
        };
    const actionItems: ActionBarItem[] = [
        {
            icon: <Trash2 size={24} />,
            label: '삭제',
            backgroundColor: 'rgba(250, 83, 83, 0.2)',
            iconColor: '#FA5353',
            textColor: '#FA5353',
            onClick: () => {
                deleteLost(lostId);
            },
        },
        {
            icon: <Pencil size={24} />,
            label: '수정',
            backgroundColor: '#F9F9F9',
            iconColor: '#FDC019',
            textColor: '#010101',
            onClick: () => router.push(`/losts/${lostId}/edit`),
        }]
    const columns: Column<LostClaim>[] = [
        {
            header: "#",
            width: "40px",
            render: (_, index) => <span className="text-gray font-medium">{index + 1}</span>,
        },
        {
            header: "이름",
            width: "200px",
            render: (row) => (
            <Link href={`/users/${row.user.id}`} className="underline flex gap-1 items-center">
                <Image src={row.user.avatarUrl!} alt="user" width={24} height={24} className="rounded-full" />
                <span>{row.user.name}</span>
            </Link>
            ),
            isSortable: true,
            sortKey: "user",
        },
        {
            header: "상태",
            width: "370px",
            isSortable: true,
            sortKey: "status",
            render: (row) => getClaimStatusText(row.status),
        },
        {
            header: "날짜",
            width: "193px",
            render: (row) => formatKoreanDate(row.claimedAt),
            isSortable: true,
            sortKey: "claimedAt",
        },
        {
        header: "전달",
        width: "193px",
        render: (row) => (
            <div className="flex gap-[15px]" >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleStatusUpdateClick(row.id, "REJECTED");
                }}
                className="rounded-lg text-gray items-center  no-underline hover:bg-[#C0C0C0] text-sm flex gap-1 px-[11px] py-1.5">
                <X/>
                <span>거절</span>
            </button>
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    handleStatusUpdateClick(row.id, "COMPLETED");
                }}
                className="rounded-lg text-[#E9E9E9] items-center bg-black hover:bg-darkgray text-sm flex gap-1 px-[11px] py-1.5">
                전달하기
            </button>
            </div>
            ),
        },
    ];
    return (
        <div className="px-8 py-12 gap-[10px] flex flex-col">
            <PageHeader title="월간분실물 상세보기" isBackButton >
                <ActionBarTrigger items={actionItems} />
            </PageHeader>
            <div className="flex flex-col px-2 gap-[10px]">
                
                {lostData?.thumbnailUrl && (
                    <Image src={lostData?.thumbnailUrl.url || ''} alt="lost" width={351} height={351} 
                        className="object-cover rounded-lg h-[351px]" 
                        unoptimized 
                    />
                )}
                <InfoColumn
                    label="이름"
                    value={lostData?.title || '-'}
                />
                <InfoColumn
                    label="습득 위치"
                    value={lostData?.location || '-'}
                />
                <InfoColumn
                    label="습득 날짜"
                    value={lostData?.foundDate || '-'}
                />
                <div className="flex gap-4 overflow-x-auto pb-2 ">
                {lostData?.detailImageUrls.map((image, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-[400px] h-[280px] rounded-lg overflow-x-auto bg-gray-100"
                    >
                        <Image
                            width={400}
                            height={280}
                            unoptimized
                            src={image.url}
                            alt={`분실물 이미지 ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
                </div>
                <InfoColumn
                    label="설명"
                    value={lostData?.description || '-'}
                />
                {isLoading ? (
                        <div>로딩 중...</div>
                    ) : 
                    error ? (
                        <div>오류가 발생했습니다. {error.message}</div>
                    ) : 
                    lostData && (
                    <DataTable
                        onRefresh={ refetch }
                        columns={columns}
                        data={lostClaims?.items || []}
                        sort={sort}
                        onSortChange={onSortChange}
                    />
                    )
                }
            </div>
            <Modal className="max-w-md rounded-[20px]" isOpen={isOpen} onClose={() => {}} >
                <div className="w-full h-full flex flex-col px-6 py-5 gap-6 items-center justify-center">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-semibold text-xl text-[#000000]">정말 전달을 완료하셨나요?</h2>
                        <p className="text-[#505050] text-sm">'예'를 누르실 경우 더이상 분실물을 관리할 수 없게 됩니다. 이 작업은 되돌릴 수 없습니다.</p>
                    </div>
                    <div className="w-full flex justify-end gap-3 text-base">
                        <button onClick={() => closeModal()} className="px-[22px] py-[10px] border-gray border bg-[#F9F9F9] text-gray-700 rounded-xl">아니요</button>
                        <button onClick={() => confirmStatusUpdate()} className="px-[22px] py-[10px] bg-[#000000] text-white rounded-xl">예</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
