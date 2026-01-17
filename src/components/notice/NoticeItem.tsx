import React from 'react';
import { useRouter } from 'next/navigation';
import { Notice } from '@/lib/types/notice';

interface NoticeItemProps {
  notice: Notice;
}

export default function NoticeItem({ notice }: NoticeItemProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/notice/${notice.id}`);
  };

  // 날짜 포맷팅 (YYYY-MM-DD 형식)
  const formatDate = (dateString?: string) => {
    if (!dateString) return '2000-00-00';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '2000-00-00';
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch {
      return '2000-00-00';
    }
  };

  const displayTitle = notice.title || '제목 없음';

  return (
    <div
      onClick={handleClick}
      className="px-6 py-5 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-[15px] text-gray-900 truncate leading-relaxed">
            {displayTitle}
          </h3>
        </div>

        <div className="flex items-center gap-6 flex-shrink-0">
          <span className="text-[14px] text-gray-600">
            {formatDate(notice.createdAt)}
          </span>
          <span className="text-[14px] text-gray-500">
            ({notice.author || '작성자'})
          </span>
        </div>
      </div>
    </div>
  );
}