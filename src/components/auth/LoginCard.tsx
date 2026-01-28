import React, { ReactNode } from "react";

interface LoginCardProps {
  children: ReactNode;
}

export default function LoginCard({ children }: LoginCardProps) {
  return (
    <div className="bg-[#fff] rounded-2xl sm:rounded-3xl px-8 sm:px-20 py-12 sm:py-16 flex flex-col items-center w-full max-w-md">
      {children}
    </div>
  );
}