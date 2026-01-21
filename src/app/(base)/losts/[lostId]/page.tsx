"use client";
import ActionBarTrigger from "@/components/common/action/ActionBarTrigger";
import PageHeader from "@/components/layout/page/PageHeader";
import { ActionBarItem } from "@/components/common/action/ActionBar";
import { Trash2, Edit } from "lucide-react";
import { InfoColumn } from "@/components/ui/InfoCol";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useLostDetailQuery } from "@/lib/queries/losts/queries";

export default function LostDetailPage() {
    const params = useParams();
    const lostId = params.lostId!.toString();
    console.log(lostId);
    const { data: lostData, isLoading } = useLostDetailQuery(lostId);
    const actionItems: ActionBarItem[] = [
  {
    icon: <Trash2 size={24} />,
    label: '삭제',
    backgroundColor: '#F9F9F9',
    iconColor: '#FA5353',
    textColor: '#FA5353',
    onClick: () => console.log('삭제'),
  },
  {
    icon: <Edit size={24} />,
    label: '수정',
    backgroundColor: '#F9F9F9',
    iconColor: '#FDC019',
    textColor: '#010101',
    onClick: () => console.log('수정'),
  }]
    return (
        <div className="px-8 py-12 gap-[10px] flex flex-col">
            <div className="flex justify-between">
                <PageHeader title="월간분실물 상세보기" isBackButton />
                <ActionBarTrigger items={actionItems} />
            </div>
            <div className="flex flex-col px-2 gap-[10px]">
                
                
                {lostData?.thumbnailUrl.url && <Image src={lostData?.thumbnailUrl.url} alt="lost" width={351} height={351} />}
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
                    label="분실 날짜"
                    value={lostData?.lostDate || '-'}
                />
            </div>
        </div>
    );
}