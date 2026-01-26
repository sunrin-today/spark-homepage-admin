import ConfirmModal from "../ui/modal/ConfirmModal";
import { useDeleteEvent } from "@/lib/queries/events/mutations";
import { useModal } from "@/contexts/ModalContexts";
export default function EventDeleteModal({eventId}: {eventId: string}) {
    const deleteEventMutation = useDeleteEvent();
    const {close} = useModal();
    return (
        <ConfirmModal
            title="이벤트 삭제"
            message="정말로 이 이벤트를 삭제하시겠습니까?"
            onClose={() => {close()}}
            onConfirm={() => {deleteEventMutation.mutate(eventId);}}
        />
    )
}