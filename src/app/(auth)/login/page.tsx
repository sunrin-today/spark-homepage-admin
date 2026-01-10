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

      await login();

      // 로그인 성공 시 홈으로 리다이렉트
      router.push("/");
    } catch (error: any) {
      console.error("로그인 실패:", error);
      setError(error.message || "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
}