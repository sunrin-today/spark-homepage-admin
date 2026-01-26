"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function useTabHook(key: string, defaultTab = "") {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = searchParams.get(key);

  const setTab = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, String(next));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return { tab, setTab };
}