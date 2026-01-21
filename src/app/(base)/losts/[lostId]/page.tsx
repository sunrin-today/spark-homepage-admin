"use client";
import ActionBarTrigger from "@/components/common/action/ActionBarTrigger";
import PageHeader from "@/components/layout/page/PageHeader";
import { ActionBarItem } from "@/components/common/action/ActionBar";
import { Trash2, Edit } from "lucide-react";
import { InfoColumn } from "@/components/ui/InfoCol";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useLostDetailQuery } from "@/lib/queries/losts/queries";
import { useRouter } from "next/navigation";
import { useDeleteLostMutation } from "@/lib/queries/losts/mutations";
import { DataTable } from "@/components/common/table/DataTable";
import { Column } from "@/lib/types/table";
import { LostClaim } from "@/lib/types/lostClaims";
import { useTableSort } from "@/lib/hooks/useTableSort";

export default function LostDetailPage() {
    const params = useParams();
    const lostId = params.lostId!.toString();
    console.log(lostId);
    const { data: lostData, isLoading , error} = useLostDetailQuery(lostId);
    // const { data: lostClaims } = useLostClaimsQuery(lostId);
    const { sort, onSortChange } = useTableSort({ key: "createdAt", order: "DESC" });
    const { mutate: deleteLost, isPending: isDeleting , isError: isDeleteError} = useDeleteLostMutation();
    const router = useRouter();
    const actionItems: ActionBarItem[] = [
  {
    icon: <Trash2 size={24} />,
    label: '삭제',
    backgroundColor: '#F9F9F9',
    iconColor: '#FA5353',
    textColor: '#FA5353',
    onClick: () => deleteLost(lostId),
  },
  {
    icon: <Edit size={24} />,
    label: '수정',
    backgroundColor: '#F9F9F9',
    iconColor: '#FDC019',
    textColor: '#010101',
    onClick: () => router.push(`/losts/${lostId}/edit`),
  }]
  const tableColumns: Column<LostClaim>[] = [
    {
        sortKey: 'id',
        header: 'ID',
        render: () => lostId,
    }
  ]
    return (
        <div className="px-8 py-12 gap-[10px] flex flex-col">
            <div className="flex justify-between">
                <PageHeader title="월간분실물 상세보기" isBackButton />
                <ActionBarTrigger items={actionItems} />
            </div>
            <div className="flex flex-col px-2 gap-[10px]">
                
                
                <Image src={lostData?.thumbnailUrl.url || ''} alt="lost" width={351} height={351} className="object-cover rounded-lg h-[351px]" unoptimized />
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
                <InfoColumn
                    label="설명"
                    value={lostData?.description || '-'}
                />
{/*                 
                <DataTable
                    columns={tableColumns}
                    data={lostData.item}
                    sort={sort}
                    onSortChange={onSortChange}
                /> */}
            </div>
        </div>
    );
}