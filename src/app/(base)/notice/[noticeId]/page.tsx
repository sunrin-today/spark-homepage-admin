'use client';

import { useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Trash2, Pencil } from 'lucide-react';
import PageHeader from '@/components/layout/page/PageHeader';
import ActionBarTrigger from '@/components/common/action/ActionBarTrigger';
import { ActionBarItem } from '@/components/common/action/ActionBar';
import { useModal } from '@/contexts/ModalContexts';
import ConfirmModal from '@/components/ui/modal/ConfirmModal';
import { useNotice } from '@/lib/queries/notices/queries';
import { useDeleteNotice } from '@/lib/queries/notices/mutations';
import { formatKoreanDate } from '@/utils/date';

export default function NoticeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const noticeId = params.noticeId as string;
  const { open, close } = useModal();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: notice, isLoading, error } = useNotice(noticeId);
  const deleteNoticeMutation = useDeleteNotice();

  const handleDelete = async () => {
    if (!notice) return;

    open(
      <ConfirmModal
        title="공지사항 삭제"
        message="정말로 삭제하시겠습니까?"
        onClose={() => close()}
        onConfirm={() => {
          deleteNoticeMutation.mutate(notice.id);
          close();
        }}
      />
    );
  };

  const handleEdit = () => {
    if (!notice) return;
    router.push(`/notice/${notice.id}/edit`);
  };

  const actionItems: ActionBarItem[] = [
    {
      icon: <Trash2 size={24} />,
      label: '삭제',
      hoverBackgroundColor: 'rgba(250, 83, 83, 0.2)',
      backgroundColor: '#F9F9F9',
      iconColor: '#FA5353',
      textColor: '#FA5353',
      onClick: handleDelete,
    },
    {
      icon: <Pencil size={24} />,
      label: '수정',
      backgroundColor: '#F9F9F9',
      iconColor: '#FDC019',
      textColor: 'black',
      onClick: handleEdit,
    }
  ];

  const getImages = (): string[] => {
    if (!notice) return [];
    
    if (notice.imageUrls && Array.isArray(notice.imageUrls) && notice.imageUrls.length > 0) {
      return notice.imageUrls;
    }
    
    if (notice.images && Array.isArray(notice.images) && notice.images.length > 0) {
      return notice.images
        .sort((a, b) => a.index - b.index)
        .map(img => img.url)
        .filter(url => url && url.trim() !== '');
    }
    
    return [];
  };


  if (error || !notice) {
    return (
      <div className="px-8 py-12 gap-[10px] flex flex-col">
        <PageHeader title="공지사항 상세보기" isBackButton />
        <div className="flex items-center justify-center py-20">
          <div className="text-gray">공지사항을 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }

  const imageList = getImages();

  return (
    <div className="px-8 py-12 gap-[10px] flex flex-col">
      <PageHeader title="공지사항 상세보기" isBackButton>
        <ActionBarTrigger items={actionItems} />
      </PageHeader>

      <div className="flex flex-col px-2 gap-[10px]">
        <div className="mb-[10px]">
          <label className="block text-sm text-[#767676] mb-2">제목</label>
          <div className="text-base font-regular text-black">
            {notice.title}
          </div>
        </div>

        <div className="mb-[10px]">
          <label className="block text-sm text-[#767676] mb-2">작성일</label>
          <div className="text-base font-regular text-black">
            {formatKoreanDate(notice.createdAt)}
          </div>
        </div>

        {imageList.length > 0 && (
          <div className="mb-[10px]">
            <div 
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-2"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
              onWheel={(e) => {
                const container = scrollRef.current;
                if (container && container.scrollWidth > container.clientWidth) {
                  e.preventDefault();
                  const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;
                  container.scrollLeft += delta;
                }
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {imageList.map((imageUrl, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[400px] h-[280px] rounded-lg overflow-hidden bg-gray border border-gray"
                >
                  <img
                    src={imageUrl}
                    alt={`공지사항 이미지 ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Failed to load image ${index}:`, imageUrl);
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="flex items-center justify-center h-full text-gray text-sm">
                            이미지를 불러올 수 없습니다
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-[10px]">
          <label className="block text-sm text-[#767676] mb-2">설명</label>
          <div className="text-base text-black whitespace-pre-wrap leading-relaxed">
            {notice.content}
          </div>
        </div>
      </div>
    </div>
  );
}