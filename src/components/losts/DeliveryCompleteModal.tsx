

import { Modal } from "@/components/ui/modal/Modal";

export default function DeleveryCompleteModal({ title, message, onClose, onConfirm }: { title?: string, message?: string, onClose: () => void, onConfirm: () => void }) {
    return (
        <Modal className="max-w-md rounded-[20px]" isOpen={true} onClose={onClose} >
            <div className="w-full h-full flex flex-col px-6 py-5 gap-6 items-center justify-center">
                <div className="flex flex-col gap-1">
                    <h2 className="font-semibold text-xl text-[#000000]">{title || "정말 전달을 완료하셨나요?"}</h2>
                    <p className="text-[#505050] text-sm">{message || "'예'를 누르실 경우 더이상 분실물을 관리할 수 없게 됩니다. 이 작업은 되돌릴 수 없습니다."}</p>
                </div>
                <div className="w-full flex justify-end gap-3 text-base">
                    <button onClick={() => onClose?.()} className="px-[22px] py-[10px] border-gray border bg-[#F9F9F9] text-gray-700 rounded-xl">아니요</button>
                    <button onClick={() => onConfirm?.()} className="px-[22px] py-[10px] bg-[#000000] text-white rounded-xl">예</button>
                </div>
            </div>
        </Modal>
    );
};