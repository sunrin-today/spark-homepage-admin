"use client";

import { useAuth } from "@/contexts/AuthContexts";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from '@/components/layout/sidebar/Sidebar';
import { useMeQuery } from "@/lib/queries/auth/queries";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const router = useRouter();

  // TanStack Query로 사용자 정보 조회
  const { data: userInfo, isLoading: isUserLoading } = useMeQuery(
    !!firebaseUser && !authLoading
  );

  useEffect(() => {
    if (authLoading) return;

    if (!firebaseUser) {
      router.push("/login");
      return;
    }

    // 사용자 정보 로딩 실패 시 로그인 페이지로 이동
    if (!isUserLoading && !userInfo) {
      router.push("/login");
    }
  }, [firebaseUser, authLoading, userInfo, isUserLoading, router]);

  // 로딩 중이거나 인증되지 않은 경우
  if (authLoading || isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  // 인증되지 않은 경우
  if (!firebaseUser || !userInfo) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}