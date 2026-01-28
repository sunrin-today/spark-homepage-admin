export interface ListResponse<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
  total: number;
}


export type FormImageListItem =
  | { type: "exists"; url: string; id: string }
  | { type: "new"; file: File; preview: string; id: string };

export type ImageItem = { url: string; index: number }
  