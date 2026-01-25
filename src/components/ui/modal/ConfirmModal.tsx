

import { Modal } from "./Modal";

export default function ConfirmModal({ title, message, onClose, onConfirm }: { title?: string, message?: string, onClose: () => void, onConfirm: () => void }) {
    return (
        <Modal className="max-w-md rounded-[20px] h-[230px] flex items-center justify-center" isOpen={true} onClose={onClose} >
            <div className="max-w-[290px] flex flex-col items-center justify-center gap-[25px]">
                <div className="flex flex-col items-center justify-center gap-[13px]">
                    <h2 className="font-semibold text-2xl text-[#000000]">{title || "상태를 변경하시겠습니까?"}</h2>
                    <p className="text-[#000000] text-xs text-center">{message || "상태를 변경하실 경우 변경된 상태는 #번 충전기 상세페이지에 기록 되며 해당 기록은 지우거나 수정할 수 없습니다."}</p>
                </div>
                <div className="w-full flex justify-center gap-12 text-base">
                    <button onClick={() => onConfirm?.()} className="px-[22px] py-[10px] bg-[#0D0D0D] text-white rounded-[100px]">예</button>
                    <button onClick={() => onClose?.()} className="px-[22px] py-[10px] border-[#0D0D0D] border bg-[#F9F9F9] text-[#0D0D0D] rounded-[100px]">아니요</button>
                    
                </div>
            </div>
        </Modal>
    );
};