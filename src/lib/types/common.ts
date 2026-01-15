export interface ListResponse<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
  total: number;
}