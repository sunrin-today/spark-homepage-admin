"use client";

import { useAuth } from "@/contexts/AuthContexts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from '@/components/layout/sidebar/Sidebar';
import { usersApi } from "@/lib/api/users";
import type { User } from "@/lib/types/users";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (authLoading) return;

      if (!firebaseUser) {
        router.push("/login");
        return;
      }

      try {
        const userData = await usersApi.getMe();
        setUserInfo(userData);

        /*
        if (userData.role !== "ADMIN") {
          alert("관리자만 로그인이 가능합니다.");
          router.push("/login");
        }
        */
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [firebaseUser, authLoading, router]);

  // 로딩 중
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  // 인증되지 않은 경우 또는 ADMIN이 아닐 때
  /*
  if (!firebaseUser || !userInfo || userInfo.role !== "ADMIN") {
    return null;
  }
  */

  // ADMIN 권한이 있으면 정상 렌더링
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}