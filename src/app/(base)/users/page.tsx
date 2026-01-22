"use client";

import React, { useState } from "react";
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

const ITEMS_PER_PAGE = 5;

const UsersPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  
  const { page, setPage } = usePaginationQuery("page", 1);
  const { sort, onSortChange } = useTableSort({ key: "email", order: "DESC" });
  
  const deleteUserMutation = useDeleteUserMutation();

  // 사용자 목록 조회
  const { data, isLoading } = useUsersQuery({
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
  const handleDelete = async (userId: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteUserMutation.mutateAsync(userId);
        alert("삭제되었습니다.");
      } catch (error) {
        alert("삭제에 실패했습니다.");
      }
    }
  };

  const columns: Column<User>[] = [
    {
      header: "#",
      width: "60px",
      render: (_, index) => {
        const itemNumber = (page - 1) * ITEMS_PER_PAGE + index + 1;
        return <span>{itemNumber}</span>;
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
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-base text-white">
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
      render: (user) => <span>{user.email}</span>,
    },
    {
      header: "역할",
      sortKey: "role",
      isSortable: true,
      width: "120px",
      render: (user) => (
        <span className={user.role === "ADMIN" ? "font-regular" : ""}>
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
            label: "삭제",
            backgroundColor: "rgb(250, 83, 83, 0.2)",
            iconColor: "#FA5353",
            textColor: "#FA5353",
            onClick: () => handleDelete(user.id),
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
    <div className="flex flex-col gap-6 p-8">
      <PageHeader title="사용자 목록" />

      <SearchBar
        value={searchTerm}
        placeholder="검색어를 입력해주세요..."
        buttonText="검색하기"
        onChangeText={setSearchTerm}
        onSubmit={handleSearch}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      ) : data?.items && data.items.length > 0 ? (
        <>
          <DataTable
            columns={columns}
            data={data.items}
            sort={sort}
            onSortChange={onSortChange}
            onRowClick={(user: User) => router.push(`/users/${user.id}`)}
          />

          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            totalItems={data.total}
            onPageChange={setPage}
          />
        </>
      ) : (
        <div className="flex items-center justify-center py-20 border border-[#D5D5D5] rounded-2xl">
          <div className="text-gray-500">사용자가 없습니다.</div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;