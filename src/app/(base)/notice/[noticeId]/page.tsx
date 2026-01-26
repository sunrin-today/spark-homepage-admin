'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, MoreVertical, Trash2, Edit } from 'lucide-react';
import { noticesApi } from '@/lib/api/notice';
import { Notice } from '@/lib/types/notice';

export default function NoticeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const noticeId = params.noticeId as string;
  
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleDelete = async () => {
    if (!notice) return;

    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await noticesApi.deleteNotice(notice.id);
        alert('삭제되었습니다.');
        router.push('/notice');
      } catch (error) {
        console.error('Failed to delete notice:', error);
        alert('삭제에 실패했습니다.');
      }
    }
    setIsMenuOpen(false);
  };

  const handleEdit = () => {
    if (!notice) return;
    router.push(`/notice/${notice.id}/edit`);
    setIsMenuOpen(false);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">공지사항을 찾을 수 없습니다.</div>
      </div>
    );
  }

  const imageList = getImages(notice);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-gray-700 hover:text-gray-900"
              aria-label="뒤로가기"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">공지사항 상세보기</h1>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="메뉴"
            >
              <MoreVertical className="w-6 h-6 text-gray-700" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                  액션
                </div>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  삭제
                </button>
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-yellow-50 flex items-center gap-2 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  수정
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">제목</label>
          <div className="text-lg font-medium text-gray-900">
            {notice.title}
          </div>
        </div>

        {imageList.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">이미지</label>
            <div 
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
                  className="flex-shrink-0 w-[400px] h-[280px] rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
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
                          <div class="flex items-center justify-center h-full text-gray-400 text-sm">
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

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">설명</label>
          <div className="text-base text-gray-900 whitespace-pre-wrap leading-relaxed">
            {notice.content}
          </div>
        </div>
      </div>
    </div>
  );
}