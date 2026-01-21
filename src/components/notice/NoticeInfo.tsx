import { Notice } from '@/lib/types/notice';

interface NoticeInfoProps {
  notice: Notice;
}

// ISO 날짜를 한국 형식으로 변환
const formatDate = (isoDate: string): string => {
  try {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return isoDate;
  }
};

export default function NoticeInfo({ notice }: NoticeInfoProps) {
  const formattedDate = formatDate(notice.createdAt);
  const author = notice.author || 'Admin';

  return (
    <div className="border-b border-gray-200 px-6 py-4">
      <div className="flex items-start justify-between">
        <h2 className="text-sm font-normal text-gray-900 flex-1">
          {notice.title}
        </h2>
        <div className="flex items-center gap-6 text-sm text-gray-500 flex-shrink-0 ml-4">
          <span>{formattedDate}</span>
          <span>({author})</span>
        </div>
      </div>
    </div>
  );
}