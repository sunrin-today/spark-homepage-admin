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
  author?: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  images?: NoticeImage[];
  views?: number;
  isPinned?: boolean;
  imageUrls?: string[]; // 이미지 url 배열
}

export interface NoticeListResponse {
  items: NoticeDetailResponse[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface NoticeDetailResponse {
  id: string;
  title: string;
  content: string;
  viewCount: number;
  images?: NoticeImage[]; // 객체 배열
  createdAt: string;
  updatedAt: string;
  author?: NoticeAuthor;
}