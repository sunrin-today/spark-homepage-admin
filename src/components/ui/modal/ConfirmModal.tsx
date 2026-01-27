

import { Modal } from "@/components/ui/modal/Modal";

export default function ConfirmModal({ title, message, onClose, onConfirm }: { title?: string, message?: string, onClose: () => void, onConfirm: () => void }) {
    return (
        <Modal className="max-w-md rounded-[20px]" isOpen={true} onClose={onClose} >
            <div className="w-full h-full flex flex-col px-6 py-5 gap-6 items-center justify-center">
                <div className="w-full flex flex-col gap-1">
                    <h2 className="font-semibold text-xl text-black">{title || "상태를 변경하시겠습니까?"}</h2>
                    <p className="text-[#505050] text-sm">{message || "상태를 변경하실 경우 변경된 상태는 충전기 상세 페이지에 기록되며 해당 기록은 지우거나 수정할 수 없습니다."}</p>
                </div>
                <div className="w-full flex justify-end gap-3 text-base">
                    <button onClick={() => onClose?.()} className="px-[22px] py-[10px] border-gray border bg-[#F9F9F9] text-black rounded-xl">아니요</button>
                    <button onClick={() => onConfirm?.()} className="px-[22px] py-[10px] bg-black text-white rounded-xl">예</button>
                </div>
            </div>
        </Modal>
    );
};