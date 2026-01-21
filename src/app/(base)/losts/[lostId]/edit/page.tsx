"use client"
import PageHeader from "@/components/layout/page/PageHeader";
import { useLostDetailQuery } from "@/lib/queries/losts/queries";
import { useParams } from "next/navigation";
import { useUpdateLostMutation } from "@/lib/queries/losts/mutations";
import LostForm from "@/components/losts/LostForm";
import { useEffect } from "react";
export default function EditLostPage() {
    const lostId = useParams().lostId!.toString();
    const {data : lost, isLoading: isLostLoading, error: lostError } = useLostDetailQuery(lostId!);
    useEffect(() => {
        console.log("lostId", lostId);
    }, [lostId]);
    const {mutate: updateLostMutation, isPending: isUpdating, error: updateError} = useUpdateLostMutation(lostId!, lost?.detailImageUrls || []);
    return (   
        <div className="px-8 py-12 flex flex-col gap-[10px]">
            <PageHeader title="분실물 수정" isBackButton />
                 
            {isLostLoading && <div>로딩 중...</div>}
            {lostError && (
            <div className="mb-6 p-4 text-error rounded-lg">
                    분실물을 불러오는 중 오류가 발생했습니다: {lostError.message}
                </div>
            )}
            {updateError && (
                <div className="mb-6 p-4 text-error rounded-lg">
                    분실물을 수정하는 중 오류가 발생했습니다: {updateError.message}
                </div>
            )}
            {lost &&
                <LostForm 
                    mode="update"
                    initialData={lost}
                    mutation={updateLostMutation}
                    isPending={isUpdating}
                />
            }
        </div>
    );
}