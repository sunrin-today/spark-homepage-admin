"use client"
import PageHeader from "@/components/layout/page/PageHeader";
import { useLostDetailQuery } from "@/lib/queries/losts/queries";
import { useParams } from "next/navigation";
import { useUpdateLostMutation, useDeleteLostMutation } from "@/lib/queries/losts/mutations";
import LostForm from "@/components/losts/LostForm";
import ActionBarTrigger from "@/components/common/action/ActionBarTrigger";
import { Trash2 } from "lucide-react";
import { useModal } from "@/contexts/ModalContexts";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";
export default function EditLostPage() {
    const lostId = useParams().lostId!.toString();
    const {data : lost, isLoading: isLostLoading, error: lostError} = useLostDetailQuery(lostId!);
    const { open, close} = useModal()
    const {mutate: updateLostMutation, isPending: isUpdating, error: updateError} = useUpdateLostMutation(lostId!, lost?.detailImageUrls || []);
    const {mutate: deleteLostMutation, isPending: isDeleting, error: deleteError} = useDeleteLostMutation();
    const actionItems = [
            {
            icon: <Trash2 size={24} />,
            label: '삭제',
            hoverBackgroundColor: 'rgba(250, 83, 83, 0.2)',
            backgroundColor: '#F9F9F9',
            iconColor: '#FA5353',
            textColor: '#FA5353',
            onClick: () => {
                open(
                    <ConfirmModal
                        title="분실물 삭제"
                        message="정말로 이 분실물을 삭제하시겠습니까?"
                        onConfirm={() => {
                            deleteLostMutation(lostId);
                            close();
                        }}
                        onClose={() => close()}
                    />
                )
            },
        },

    ];
    return (   
        <div className="px-8 py-12 flex flex-col gap-[10px]">
            <PageHeader title="분실물 수정" isBackButton >
                <ActionBarTrigger items={actionItems} />
            </PageHeader>
            {lost &&
                <LostForm 
                    mode="update"
                    initialData={lost}
                    mutation={updateLostMutation}
                    error={updateError || deleteError ? "분실물을 수정하는 중 오류가 발생했습니다: " + (updateError?.message || deleteError?.message) : ""}
                    isPending={isUpdating || isDeleting}
                />
            }
        </div>
    );
}