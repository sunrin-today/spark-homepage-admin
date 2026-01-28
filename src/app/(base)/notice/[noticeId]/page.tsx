'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Trash2, Pencil } from 'lucide-react';
import { noticesApi } from '@/lib/api/notice';
import { Notice } from '@/lib/types/notice';
import PageHeader from '@/components/layout/page/PageHeader';
import ActionBarTrigger from '@/components/common/action/ActionBarTrigger';
import { ActionBarItem } from '@/components/common/action/ActionBar';
import { useModal } from '@/contexts/ModalContexts';
import ConfirmModal from '@/components/ui/modal/ConfirmModal';

export default function NoticeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const noticeId = params.noticeId as string;
  const { open, close } = useModal();
  
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const data = await noticesApi.getNoticeById(noticeId);
        setNotice(data);
      } catch (error) {
        console.error('Failed to fetch notice:', error);
        alert('공지사항을 불러오는데 실패했습니다.');
        router.push('/notice');
      } finally {
        setLoading(false);
      }
    };

    if (noticeId) {
      fetchNotice();
    }
  }, [noticeId, router]);

  // 이미지 스크롤 영역 휠 이벤트 처리
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      // 수평 스크롤이 있는 경우에만 
      if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
        e.preventDefault();
        
        // deltaY(상하 스크롤)를 수평 스크롤로 변환
        // deltaX(좌우 스크롤)는 그대로 사용
        const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;
        scrollContainer.scrollLeft += delta;
      }
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
    };
  }, [notice]);

  const handleDelete = async () => {
    if (!notice) return;

    open(
      <ConfirmModal
        title="공지사항 삭제"
        message="정말로 삭제하시겠습니까?"
        onClose={() => close()}
        onConfirm={async () => {
          try {
            await noticesApi.deleteNotice(notice.id);
            alert('삭제되었습니다.');
            router.push('/notice');
            close();
          } catch (error) {
            console.error('Failed to delete notice:', error);
            alert('삭제에 실패했습니다.');
            close();
          }
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

  // 이미지 배열 파싱 - imageUrls 우선, 없으면 images에서 추출
  const getImages = (notice: Notice): string[] => {
    // imageUrls가 있으면 우선 사용
    if (notice.imageUrls && Array.isArray(notice.imageUrls) && notice.imageUrls.length > 0) {
      return notice.imageUrls;
    }
    
    // images 배열이 있으면 url 추출
    if (notice.images && Array.isArray(notice.images) && notice.images.length > 0) {
      return notice.images
        .sort((a, b) => a.index - b.index) // index 순서로 정렬
        .map(img => img.url)
        .filter(url => url && url.trim() !== ''); // 빈 URL 필터링
    }
    
    return [];
  };


  if (!notice) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray">공지사항을 찾을 수 없습니다.</div>
      </div>
    );
  }

  const imageList = getImages(notice);

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

        {imageList.length > 0 && (
          <div className="mb-[10px]">
            <div 
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-2"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
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