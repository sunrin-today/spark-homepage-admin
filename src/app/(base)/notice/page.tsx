'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { SearchBar } from '@/components/common/search/SearchBar';
import Pagination from '@/components/common/pagination/Pagination';
import { usePaginationQuery } from '@/lib/hooks/usePaginationQuery';
import { useTableSort } from '@/lib/hooks/useTableSort';
import { DataTable } from '@/components/common/table/DataTable';
import { Column } from '@/lib/types/table';
import ActionBarTrigger from '@/components/common/action/ActionBarTrigger';
import { ActionBarItem } from '@/components/common/action/ActionBar';
import { useModal } from '@/contexts/ModalContexts';
import ConfirmModal from '@/components/ui/modal/ConfirmModal';
import PageHeader from '@/components/layout/page/PageHeader';
import { useNotices } from '@/lib/queries/notices/queries';
import { useDeleteNotice } from '@/lib/queries/notices/mutations';
import { Notice } from '@/lib/types/notice';

const ITEMS_PER_PAGE = 10;

export default function NoticesPage() {
  const router = useRouter();
  const { open, close } = useModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const { page: currentPage, setPage: setCurrentPage } = usePaginationQuery('page', 1);
  const { sort, onSortChange } = useTableSort({ key: 'createdAt', order: 'DESC' });

  const { data: notices = [], isLoading, refetch, isRefetching } = useNotices();
  const deleteNoticeMutation = useDeleteNotice();

  const filteredNotices = actualSearchQuery.trim()
    ? notices.filter((notice) =>
        notice.title?.toLowerCase().includes(actualSearchQuery.toLowerCase())
      )
    : notices;

  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (!sort.key) return 0;
    
    const aValue = a[sort.key as keyof Notice];
    const bValue = b[sort.key as keyof Notice];
    
    if (aValue === undefined || bValue === undefined) return 0;
    
    if (sort.order === 'ASC') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedNotices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNotices = sortedNotices.slice(startIndex, endIndex);

  const handleSearch = (searchTerm: string) => {
    setActualSearchQuery(searchTerm);
    setCurrentPage(1);
  };

  const handleDelete = async (noticeId: string, noticeTitle: string) => {
    open(
      <ConfirmModal
        title="공지사항 삭제"
        message={`"${noticeTitle}" 공지사항을 정말로 삭제하시겠습니까?`}
        onClose={() => close()}
        onConfirm={() => {
          deleteNoticeMutation.mutate(noticeId);
          close();
        }}
      />
    );
  };

  const columns: Column<Notice>[] = [
    {
      header: '#',
      sortKey: 'index',
      isSortable: false,
      width: '80px',
      render: (_, index) => <span className="text-[#767676] font-medium">{startIndex + index + 1}</span>,
    },
    {
      header: '제목',
      sortKey: 'title',
      isSortable: true,
      width: 'auto',
      render: (notice) => (
        <span className="font-regular text-black text-base">
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
              <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={avatarUrl}
                  alt={authorName}
                  fill
                  sizes="24px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <span className="font-regular text-black text-base">
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
        <span className="font-regular text-black text-base whitespace-nowrap">
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
            hoverBackgroundColor: 'rgba(250, 83, 83, 0.2)',
            backgroundColor: '#F9F9F9',
            iconColor: '#FA5353',
            textColor: '#FA5353',
            onClick: () => handleDelete(notice.id, notice.title),
          },
          {
            icon: <Pencil size={24} />,
            label: '수정',
            backgroundColor: '#F9F9F9',
            iconColor: '#FDC019',
            textColor: 'black',
            onClick: () => router.push(`/notice/${notice.id}/edit`),
          },
        ];

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ActionBarTrigger title="액션" items={actionItems} />
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4 px-8 py-12">
      <PageHeader title="공지사항" />

      <div className="w-full sm:max-w-xl">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearch}
          placeholder="검색어를 입력해주세요..."
          buttonText="검색하기"
          className="w-full"
        />
      </div>

      <div className="flex justify-end mt-[10px]">
        <button
          onClick={() => router.push('/notice/add')}
          className="w-full sm:w-auto px-3 py-3 bg-black text-white rounded-2xl transition-colors whitespace-nowrap font-medium flex items-center justify-center gap-2"
        >
          <Plus size={24} />
          <span>등록하기</span>
        </button>
      </div>

      {filteredNotices.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <DataTable
                columns={columns}
                data={currentNotices}
                sort={sort}
                onSortChange={onSortChange}
                onRefresh={refetch}
                isRefreshing={isRefetching}
                onRowClick={(notice) => router.push(`/notice/${notice.id}`)}
              />
            </div>
          </div>

          <div className="px-4 sm:px-0">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={sortedNotices.length}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center py-20 border border-[#D5D5D5] rounded-2xl mx-4 sm:mx-0">
          <div className="text-gray text-sm sm:text-base">
            {searchQuery
              ? '검색 결과가 없습니다.'
              : '등록된 공지사항이 없습니다.'}
          </div>
        </div>
      )}
    </div>
  );
}