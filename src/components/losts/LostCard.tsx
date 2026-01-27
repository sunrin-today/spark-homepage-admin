import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDeleteLostMutation } from "@/lib/queries/losts/mutations";
import { ActionBarItem } from "../common/action/ActionBar";
import ActionBarTrigger from "../common/action/ActionBarTrigger";
import { Lost } from "@/lib/types/losts";
import Link from "next/link";
import ConfirmModal from "../ui/modal/ConfirmModal";
import { useModal } from "@/contexts/ModalContexts";


export const LostCard = ({lost}: {lost: Lost}) => {
  const router = useRouter();
  const {open, close } = useModal();
  const deleteLostMutation = useDeleteLostMutation();
  const actionItems: ActionBarItem[] = [    
  {
    icon: <Trash2 size={24} />,
    label: '삭제',
    backgroundColor: '#F9F9F9',
    hoverBackgroundColor: 'rgba(250, 83, 83, 0.2)',
    iconColor: '#FA5353',
    textColor: '#FA5353',
    onClick: () => {
        open(<ConfirmModal
            onClose={() => close()}
            onConfirm={() => {
                deleteLostMutation.mutate(lost.id, {
                    onSuccess: () => {
                        close();
                    },
                    onError: (e) => {
                        alert("삭제하는데 오류가 발생하였습니다: " + e.message)
                        close();
                    }
                });
            }}
            title="분실물 삭제"
            message="정말로 이 분실물을 삭제하시겠습니까?"
        />)
    },
  },
  {
    icon: <Pencil size={24} />,
    label: '수정',
    backgroundColor: '#F9F9F9',
    iconColor: '#FDC019',
    textColor: '#010101',
    onClick: () => router.push(`/losts/${lost.id}/edit`),
  },
];
    return (
        <div className=" w-full h-full flex flex-col items-start">
            
            <div className="w-full">
                <Link href={`/losts/${lost.id}`}>
                <Image
                    src={lost.thumbnailUrl.url}
                    alt="분실물 이미지"
                    width={233} 
                    height={233}
                    className="w-full h-[233px] aspect-square object-cover rounded-[20px]"
                    unoptimized
                />
                </Link>
            </div>
            <div className="flex items-center w-full pt-3 pb-1 min-w-0">
                <h2 className="text-lg text-black font-semibold truncate flex-1 min-w-0 pr-2">
                    {lost.title}
                </h2>
                <ActionBarTrigger items={actionItems} vertical={true}/>
            </div>
            <div className="text-sm w-full font-regular text-gray break-words line-clamp-2">
                {lost.description}
                </div>
        </div>
    );
};