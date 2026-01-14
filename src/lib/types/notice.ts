export interface Notice {
  id: string;
  title: string;
  content: string;
  author?: string; // api에 아직 author 필드가 없어서 일단 optional 처리
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  images?: string;
  views?: number;
  isPinned?: boolean; 
  imageUrl?: string; 
}

export interface NoticeListResponse {
  items: Notice[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface NoticeDetailResponse {
  id: string;
  title: string;
  content: string;
  viewCount: number;
  images?: string;
  createdAt: string;
  updatedAt: string;
}