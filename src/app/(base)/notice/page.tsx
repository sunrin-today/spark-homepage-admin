'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Plus } from 'lucide-react';
import { noticesApi } from '@/lib/api/notice';
import { Notice } from '@/lib/types/notice';
import NoticeList from '@/components/notice/NoticeList';
import { SearchBar } from '@/components/common/search/SearchBar';

const ITEMS_PER_PAGE = 10;

export default function NoticesPage() {
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await noticesApi.getNotices();
        console.log('Fetched notices:', data);
        const noticeArray = Array.isArray(data) ? data : [];
        setNotices(noticeArray);
        setFilteredNotices(noticeArray);
      } catch (error) {
        console.error('Failed to fetch notices:', error);
        setNotices([]);
        setFilteredNotices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // 검색 필터링
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNotices(notices);
      setCurrentPage(1);
      return;
    }

    const filtered = notices.filter((notice) =>
      notice.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNotices(filtered);
    setCurrentPage(1);
  }, [searchQuery, notices]);

  const handleSearch = (searchTerm: string) => {

  };

  // 페이지네이션 연산
  const totalPages = Math.ceil(filteredNotices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNotices = filteredNotices.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-6">공지사항</h1>

          <div className="flex items-center justify-between gap-4">
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmit={handleSearch}
              placeholder="검색어를 입력해주세요..."
              buttonText="검색하기"
              className="flex-1 max-w-xl"
            />

            <button
              onClick={() => router.push("/notice/add")}
              className="px-3 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap font-medium flex items-center gap-2"
            >
              <Plus size={24} />
              <span>등록하기</span>
            </button>
          </div>
        </div>

        <div className="bg-white">
          <NoticeList notices={currentNotices} />
        </div>

        {filteredNotices.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="text-sm text-gray-600 mr-4">
              {currentPage} / {totalPages} (총 {filteredNotices.length}개)
            </span>

            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-2 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="첫 페이지"
            >
              <ChevronsLeft size={16} className="text-gray-600" />
            </button>

            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="이전 페이지"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="다음 페이지"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>

            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="마지막 페이지"
            >
              <ChevronsRight size={16} className="text-gray-600" />
            </button>
          </div>
        )}

        {filteredNotices.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            {searchQuery
              ? '검색 결과가 없습니다.'
              : '등록된 공지사항이 없습니다.'}
          </div>
        )}
      </div>
    </div>
  );
}