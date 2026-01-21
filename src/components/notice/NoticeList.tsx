import React from 'react';
import NoticeItem from './NoticeItem';
import { Notice } from '@/lib/types/notice';

interface NoticeListProps {
  notices: Notice[];
}

export default function NoticeList({ notices }: NoticeListProps) {
  if (!notices || notices.length === 0) {
    return null;
  }

  return (
    <div className="bg-white">
      <div className="divide-y divide-gray-200">
        {notices.map((notice) => (
          <NoticeItem key={notice.id} notice={notice} />
        ))}
      </div>
    </div>
  );
}