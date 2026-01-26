'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { noticesApi } from '@/lib/api/notice';
import { Notice } from '@/lib/types/notice';
import { SearchBar } from '@/components/common/search/SearchBar';
import Pagination from '@/components/common/pagination/Pagination';
import { usePaginationQuery } from '@/lib/hooks/usePaginationQuery';
import { DataTable } from '@/components/common/table/DataTable';
import { Column } from '@/lib/types/table';
import ActionBarTrigger from '@/components/common/action/ActionBarTrigger';
import { ActionBarItem } from '@/components/common/action/ActionBar';

const ITEMS_PER_PAGE = 10;

export default function NoticesPage() {
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { page: currentPage, setPage: setCurrentPage } = usePaginationQuery('page', 1);

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

  useEffect(() => {
    fetchNotices();
  }, []);

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

  const handleDelete = async (noticeId: string, noticeTitle: string) => {
    if (confirm(`"${noticeTitle}" 공지사항을 정말 삭제하시겠습니까?`)) {
      try {
        await noticesApi.deleteNotice(noticeId);
        alert('공지사항이 삭제되었습니다.');
        
        await fetchNotices();
        
        // 삭제 후 현재 페이지에 데이터가 없으면 이전 페이지로
        const newFilteredNotices = notices.filter(n => n.id !== noticeId);
        const newTotalPages = Math.ceil(newFilteredNotices.length / ITEMS_PER_PAGE);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      } catch (error) {
        console.error('Failed to delete notice:', error);
        alert('공지사항 삭제에 실패했습니다.');
      }
    }
  };

  // 페이지네이션 연산
  const totalPages = Math.ceil(filteredNotices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNotices = filteredNotices.slice(startIndex, endIndex);

  const columns: Column<Notice>[] = [
    {
      header: '#',
      sortKey: 'index',
      isSortable: false,
      width: '80px',
      render: (_, index) => <span>{startIndex + index + 1}</span>,
    },
    {
      header: '제목',
      sortKey: 'title',
      isSortable: true,
      width: 'auto',
      render: (notice) => (
        <span className="font-medium underline cursor-pointer">
          {notice.title}
        </span>
      ),
    },
    {
      header: '작성자',
      sortKey: 'author',
      isSortable: true,
      width: '200px',
      render: (notice) => {
        const authorName = notice.author?.name || '관리자';
        const avatarUrl = notice.author?.avatarUrl;
        
        return (
          <div className="flex items-center gap-2">
            {avatarUrl ? (
              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                <Image
                  src={avatarUrl}
                  alt={authorName}
                  fill
                  sizes="24px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs text-white">
                  {authorName.charAt(0)}
                </span>
              </div>
            )}
            <span>{authorName}</span>
          </div>
        );
      },
    },
    {
      header: '작성일',
      sortKey: 'createdAt',
      isSortable: true,
      width: '150px',
      render: (notice) => (
        <span>
          {notice.createdAt 
            ? new Date(notice.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }).replace(/\. /g, '.').replace(/\.$/, '')
            : '-'}
        </span>
      ),
    },
    {
      header: '액션',
      sortKey: '',
      isSortable: false,
      width: '80px',
      render: (notice) => {
        const actionItems: ActionBarItem[] = [
          {
            icon: <Trash2 size={24} />,
            label: '삭제',
            backgroundColor: 'rgba(250, 83, 83, 0.2)',
            iconColor: '#FA5353',
            textColor: '#FA5353',
            onClick: () => handleDelete(notice.id, notice.title),
          },
          {
            icon: <Pencil size={24} />,
            label: '수정',
            backgroundColor: '#F9F9F9',
            iconColor: '#FDC019',
            textColor: '#010101',
            onClick: () => router.push(`/notice/${notice.id}/edit`),
          },
        ];

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ActionBarTrigger title="액션" items={actionItems} vertical />
          </div>
        );
      },
    },
  ];


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
              onClick={() => router.push('/notice/add')}
              className="px-3 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap font-medium flex items-center gap-2"
            >
              <Plus size={24} />
              <span>등록하기</span>
            </button>
          </div>
        </div>

        {filteredNotices.length > 0 ? (
          <>
            <DataTable
              columns={columns}
              data={currentNotices}
              onRowClick={(notice) => router.push(`/notice/${notice.id}`)}
            />

            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredNotices.length}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-20 border border-[#D5D5D5] rounded-2xl">
            <div className="text-gray-500">
              {searchQuery
                ? '검색 결과가 없습니다.'
                : '등록된 공지사항이 없습니다.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}