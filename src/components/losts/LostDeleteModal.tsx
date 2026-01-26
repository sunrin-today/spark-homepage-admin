import ConfirmModal from "../ui/modal/ConfirmModal";
import { useDeleteLostMutation } from "@/lib/queries/losts/mutations";
import { useModal } from "@/contexts/ModalContexts";
export default function LostDeleteModal({lostId}: {lostId: string}) {
    const deleteLostMutation = useDeleteLostMutation();
    const {close} = useModal();
    return (
        <ConfirmModal
            title="분실물 삭제"
            message="정말로 이 분실물을 삭제하시겠습니까?"
            onClose={() => {close()}}
            onConfirm={() => {deleteLostMutation.mutate(lostId);}}
        />
    )
}