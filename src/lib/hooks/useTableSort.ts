// hooks/table/useTableSort.ts
"use client"
import { useState } from "react";

export type SortOrder = "ASC" | "DESC";

export type SortState = {
  key: string;
  order: SortOrder;
};

export function useTableSort(initial: SortState) {
  const [sort, setSort] = useState<SortState>(initial);

  const onSortChange = (key: string) => {
    setSort((prev) => {
      if (prev.key === key) {
        return {
          key,
          order: prev.order === "ASC" ? "DESC" : "ASC",
        };
      }
      return {
        key,
        order: "ASC",
      };
    });
  };

  return { sort, onSortChange };
}
