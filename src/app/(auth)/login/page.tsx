"use client";

import React from "react";
import LoginCard from "@/components/auth/LoginCard";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { useGoogleLoginMutation } from "@/lib/queries/auth/mutations";

export default function LoginPage() {
  const loginMutation = useGoogleLoginMutation();

  const handleGoogleLogin = () => {
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6">
      <LoginCard>
        <div className="mb-8 sm:mb-12">
          <img 
            src="/logo/logo.svg" 
            alt="SPARK!" 
            className="w-48 sm:w-64 mx-auto" 
          />
        </div>

        <GoogleLoginButton onClick={handleGoogleLogin} />

        {/* 로딩 상태 */}
        {loginMutation.isPending && (
          <p className="mt-4 text-sm text-gray-600 text-center">로그인 중...</p>
        )}

        {/* 에러 메시지 */}
        {loginMutation.isError && (
          <div className="mt-4 text-sm text-center">
            <p className="text-red-500 font-medium">
              {loginMutation.error?.message || "로그인에 실패했습니다."}
            </p>
            {loginMutation.error?.message?.includes("관리자 권한") && (
              <p className="text-gray-600 mt-2">
                이 페이지는 관리자만 접근할 수 있습니다.
              </p>
            )}
          </div>
        )}
      </LoginCard>
    </div>
  );
}