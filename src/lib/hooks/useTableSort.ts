// hooks/table/useTableSort.ts
import { useState } from "react";

export type SortOrder = "asc" | "desc";

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
          order: prev.order === "asc" ? "desc" : "asc",
        };
      }
      return {
        key,
        order: "asc",
      };
    });
  };

  return { sort, onSortChange };
}
