"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoginCard from "@/components/auth/LoginCard";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { useAuth } from "@/contexts/AuthContexts";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // login()에서 직접 받음
      const token = await login();
      console.log("받은 토큰:", token);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("응답 상태:", response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error("에러 응답:", errorData);
        throw new Error(`사용자 정보를 가져올 수 없습니다. (${response.status}): ${errorData}`);
      }

      const userData = await response.json();
      console.log("사용자 데이터:", userData);

      // role이 admin이면 어드민 페이지로, 아니면 홈으로 리다이렉트
      if (userData.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error("로그인 실패:", error);
      setError(error.message || "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginCard>
        <div className="mb-12">
          <img src="/logo/logo.svg" alt="SPARK!" className="w-64" />
        </div>

        <GoogleLoginButton onClick={handleGoogleLogin} />

        {/* 로딩 상태 */}
        {isLoading && (
          <p className="mt-4 text-sm text-gray-600">로그인 중...</p>
        )}

        {/* 에러 메시지 */}
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </LoginCard>
    </div>
  );
}