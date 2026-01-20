"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function usePaginationQuery(key: string, defaultPage = 1) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get(key) ?? defaultPage);

  const setPage = (next: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, String(next));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return { page, setPage };
}
