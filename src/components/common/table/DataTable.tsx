
import { SortState } from "@/lib/hooks/useTableSort";
import { Column } from "@/lib/types/table";
import { ArrowDown, ArrowUp, ArrowUpDown, RefreshCw } from "lucide-react";

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  sort?: SortState;
  onSortChange?: (key: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  tableHeader?: React.ReactNode;
};


export function DataTable<T>({ columns, data, sort, onSortChange, onRefresh, isRefreshing, tableHeader }: DataTableProps<T>) {
  return (
    <div className="flex flex-col gap-3">
      <div className={`w-full flex items-center ${tableHeader ? "justify-between" : "justify-end"}`}>
        {tableHeader}
        
        <RefreshCw 
          className="w-6 h-6 p-1 text-gray cursor-pointer" 
          onClick={() => {
            onRefresh?.();
          }}
          style={{
            opacity: isRefreshing ? 0.5 : 1,
            cursor: isRefreshing ? 'not-allowed' : 'pointer'
          }}
        />
      </div>
    <div className="w-full overflow-x-auto border border-[#D5D5D5] rounded-2xl">
      
      <table className="w-full border-collapse table-fixed">
        <colgroup>
          {columns.map((col, i) => (
            <col
              key={i}
              style={{ width: col.width ?? "auto" }}
            />
          ))}
        </colgroup>
        <thead className="bg-[#E5E5E5] ">
          <tr className="text-gray border-b border-[#D0D0D0]">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`
                  px-4 py-3 text-left text-base font-semibold whitespace-nowrap
                  ${col.isSortable ? "cursor-pointer select-none" : ""}
                `}
                onClick={() => {
                  if (!col.isSortable || !col.sortKey) return;
                  onSortChange?.(col.sortKey);
                }}
              >
                <div className="flex items-center gap-1">
                  {col.header}

                  {col.isSortable && (
                    sort?.key === col.sortKey && sort ? (sort.order === "ASC" ? <ArrowUp className="w-4 h-4"/> : <ArrowDown className="w-4 h-4"/>) : <ArrowUpDown className="w-4 h-4"/>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rIdx) => (
            <tr key={rIdx} className="border-b border-[#D0D0D0] hover:underline hover:bg-lightgray">
              {columns.map((col, cIdx) => (
                <td
                  key={cIdx}
                  className="px-4 py-3 text-base truncate text-[#010101] relative">
                  {col.render(row, rIdx)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}
