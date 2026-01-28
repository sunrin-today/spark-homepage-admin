
"use client";
import PageHeader from "@/components/layout/page/PageHeader";
import LostForm from "@/components/losts/LostForm";
import { useCreateLostMutation } from "@/lib/queries/losts/mutations";

export default function AddLostPage() {
    
    const { mutate: createLost, isPending, error } = useCreateLostMutation();
    return (
        <div className="px-8 py-12 gap-[10px] flex flex-col">
            <PageHeader title="분실물 추가" isBackButton />
            {error && <div className="text-error">분실물 추가 중 오류가 발생했습니다: {error.message}</div>}
            {!error && <LostForm mode="create" mutation={createLost} isPending={isPending} />}
        </div>
    );
}