export interface ListResponse<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
  total: number;
}


export type ImageListItem =
  | { type: "exists"; url: string }
  | { type: "new"; file: File; preview: string };