import { Modal } from "../ui/modal/Modal";
import { useState } from "react";
import { DataTable } from "../common/table/DataTable";
import { usePaginationQuery } from "@/lib/hooks/usePaginationQuery";
export const ChargerRequestModal = () => {    
    const [page, setPage] = useState(1);
    return (
        <Modal isOpen={true} onClose={() => {}}>
            <div>
                <div className="flex flex-col px-2 gap-2">

                </div>
                <div className="w-full flex justify-end">
                    <button className="px-[22px] py-[10px] text-base text-white bg-[#0D0D0D] rounded-[100px]">선택완료</button>
                </div>
            </div>

        </Modal>
    );
};