import React, { ReactNode } from "react";

interface LoginCardProps {
  children: ReactNode;
}

export default function LoginCard({ children }: LoginCardProps) {
  return (
    <div className="bg-[#fff] rounded-3xl px-20 py-16 flex flex-col items-center">
      {children}
    </div>
  );
}