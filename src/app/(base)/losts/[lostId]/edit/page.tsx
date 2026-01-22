"use client"
import PageHeader from "@/components/layout/page/PageHeader";
import { useLostDetailQuery } from "@/lib/queries/losts/queries";
import { useParams } from "next/navigation";
import { useUpdateLostMutation, useDeleteLostMutation } from "@/lib/queries/losts/mutations";
import LostForm from "@/components/losts/LostForm";
import { useEffect } from "react";
import ActionBarTrigger from "@/components/common/action/ActionBarTrigger";
import { Trash2 } from "lucide-react";
export default function EditLostPage() {
    const lostId = useParams().lostId!.toString();
    const {data : lost, isLoading: isLostLoading, error: lostError} = useLostDetailQuery(lostId!);
    useEffect(() => {
        console.log("lostId", lostId);
    }, [lostId]);
    const {mutate: updateLostMutation, isPending: isUpdating, error: updateError} = useUpdateLostMutation(lostId!, lost?.detailImageUrls || []);
    const {mutate: deleteLostMutation, isPending: isDeleting, error: deleteError} = useDeleteLostMutation();
    const actionItems = [
        {
            icon: <Trash2 size={24} />,
            label: '삭제',
            backgroundColor: 'rgba(250, 83, 83, 0.2)',
            iconColor: '#FA5353',
            textColor: '#FA5353',
            onClick: () => deleteLostMutation(lostId),
        },

    ];
    return (   
        <div className="px-8 py-12 flex flex-col gap-[10px]">
            <PageHeader title="분실물 수정" isBackButton >
                <ActionBarTrigger items={actionItems} />
            </PageHeader>
            {isLostLoading && <div>로딩 중...</div>}
            {lost &&
                <LostForm 
                    mode="update"
                    initialData={lost}
                    mutation={updateLostMutation}
                    error={updateError ? "분실물을 수정하는 중 오류가 발생했습니다: " + updateError.message : ""}
                    isPending={isUpdating}
                />
            }
        </div>
    );
}