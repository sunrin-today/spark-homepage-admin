export interface NoticeImage {
  url: string;
  index: number;
}

export interface NoticeAuthor {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  studentNumber: number;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  author?: NoticeAuthor; 
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  images?: NoticeImage[];
  views?: number;
  isPinned?: boolean;
  imageUrls?: string[];
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
  images?: NoticeImage[];
  createdAt: string;
  updatedAt: string;
  author?: NoticeAuthor;
}