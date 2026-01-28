"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/common/search/SearchBar";
import { DataTable } from "@/components/common/table/DataTable";
import Pagination from "@/components/common/pagination/Pagination";
import ActionBarTrigger from "@/components/common/action/ActionBarTrigger";
import PageHeader from "@/components/layout/page/PageHeader";
import { useUsersQuery } from "@/lib/queries/users/queries";
import { useDeleteUserMutation } from "@/lib/queries/users/mutations";
import { useTableSort } from "@/lib/hooks/useTableSort";
import { usePaginationQuery } from "@/lib/hooks/usePaginationQuery";
import { Column } from "@/lib/types/table";
import { User } from "@/lib/types/users";
import { Trash2 } from "lucide-react";
import { ActionBarItem } from "@/components/common/action/ActionBar";
import { useModal } from "@/contexts/ModalContexts";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";

const ITEMS_PER_PAGE = 5;

const UsersPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const { open, close } = useModal();
  
  const { page, setPage } = usePaginationQuery("page", 1);
  const { sort, onSortChange } = useTableSort({ key: "email", order: "DESC" });
  
  const deleteUserMutation = useDeleteUserMutation();

  // 사용자 목록 조회
  const { data } = useUsersQuery({
    page,
    limit: ITEMS_PER_PAGE,
    column: sort.key,
    orderDirection: sort.order,
    query: query || undefined,
  });

  // 검색 처리
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1); // 검색 시 첫 페이지로
  };

  // 사용자 삭제
  const handleDelete = async (userId: string, userName: string) => {
    open(
      <ConfirmModal
        title="사용자 삭제"
        message={`"${userName}" 사용자를 정말로 삭제하시겠습니까?`}
        onClose={() => close()}
        onConfirm={async () => {
          try {
            await deleteUserMutation.mutateAsync(userId);
            alert("삭제되었습니다.");
            close();
          } catch (error) {
            alert("삭제에 실패했습니다.");
            close();
          }
        }}
      />
    );
  };

  const columns: Column<User>[] = [
    {
      header: "#",
      width: "60px",
      render: (_, index) => {
        const itemNumber = (page - 1) * ITEMS_PER_PAGE + index + 1;
        return <span className="text-[#767676]">{itemNumber}</span>;
      },
    },
    {
      header: "이름",
      sortKey: "name",
      isSortable: true,
      width: "200px",
      render: (user) => (
        <div className="flex items-center gap-2">
          {user.avatarUrl ? (
            <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={user.avatarUrl}
                alt={user.name}
                fill
                sizes="24px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
              <span className="font-regular text-black text-base">
                {user.name.charAt(0)}
              </span>
            </div>
          )}
          <span>{user.name}</span>
        </div>
      ),
    },
    {
      header: "이메일",
      sortKey: "email",
      isSortable: true,
      width: "300px",
      render: (user) => <span className="font-regular text-black text-base">{user.email}</span>,
    },
    {
      header: "역할",
      sortKey: "role",
      isSortable: true,
      width: "120px",
      render: (user) => (
        <span className="font-regular text-black text-base">
          {user.role === "ADMIN" ? "관리자" : "학생"}
        </span>
      ),
    },
    {
      header: "액션",
      width: "80px",
      render: (user) => {
        const actionItems: ActionBarItem[] = [
          {
            icon: <Trash2 size={24} />,
            label: '삭제',
            hoverBackgroundColor: 'rgba(250, 83, 83, 0.2)',
            backgroundColor: '#F9F9F9',
            iconColor: '#FA5353',
            textColor: '#FA5353',
            onClick: () => handleDelete(user.id, user.name),
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
      <PageHeader title="사용자 목록" />

      <div className="w-full">
        <SearchBar
          value={searchTerm}
          placeholder="검색어를 입력해주세요..."
          buttonText="검색하기"
          onChangeText={setSearchTerm}
          onSubmit={handleSearch}
          className="w-full"
        />
      </div>

      {data?.items && data.items.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <DataTable
                columns={columns}
                data={data.items}
                sort={sort}
                onSortChange={onSortChange}
                onRowClick={(user: User) => {
                  const params = new URLSearchParams({
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    ...(user.avatarUrl && { avatarUrl: user.avatarUrl })
                  });
                  router.push(`/users/${user.id}?${params.toString()}`);
                }}
              />
            </div>
          </div>

          <div className="px-4 sm:px-0">
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              totalItems={data.total}
              onPageChange={setPage}
            />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center py-20 border border-[#D5D5D5] rounded-2xl mx-4 sm:mx-0">
          <div className="text-gray text-sm sm:text-base">사용자가 없습니다.</div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;