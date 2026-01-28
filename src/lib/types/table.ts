export type Column<T> = {
  header: string;
  width?: string;
  render: (row: T, index: number) => React.ReactNode;
  isSortable?: boolean;
  sortKey?: string;
};
