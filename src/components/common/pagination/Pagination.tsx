import React from 'react';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  const handleFirstPage = () => {
    if (currentPage > 1) {
      onPageChange(1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    if (currentPage < totalPages) {
      onPageChange(totalPages);
    }
  };

  return (
    <div className="flex items-center justify-end gap-3">
      <span className="text-sm text-[#767676]">
        {currentPage} / {totalPages} (총 {totalItems}개)
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          className="p-1 border border-[#EBEBEB] rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 transition-colors"
          aria-label="첫 페이지"
        >
          <ChevronsLeft className="h-4 w-4 text-[#767676]" />
        </button>

        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="p-1 border border-[#EBEBEB] rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 transition-colors"
          aria-label="이전 페이지"
        >
          <ChevronLeft className="h-4 w-4 text-[#767676]" />
        </button>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="p-1 border border-[#EBEBEB] rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 transition-colors"
          aria-label="다음 페이지"
        >
          <ChevronRight className="h-4 w-4 text-[#767676]" />
        </button>

        <button
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          className="p-1 border border-[#EBEBEB] rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 transition-colors"
          aria-label="마지막 페이지"
        >
          <ChevronsRight className="h-4 w-4 text-[#767676]" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;


// 사용 예시
/*
const [currentPage, setCurrentPage] = useState(1);
const ITEMS_PER_PAGE = 10;

// 페이지네이션 연산
const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
const endIndex = startIndex + ITEMS_PER_PAGE;
const currentData = data.slice(startIndex, endIndex);

// 컴포넌트 사용
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={data.length}
  onPageChange={(page) => setCurrentPage(page)}
/>
*/