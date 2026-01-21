import { FormImageListItem, ImageItem } from "./common";
import { User } from "./users";

export type Lost = {
  id: string;
  title: string;
  description: string;
  location: string;
  foundDate: string;
  status: "FOUND" | "LOST";
  taker : User
  thumbnailUrl: {
    url: string;
    index: number;
  };
  detailImageUrls: {
    url: string;
    index: number;
  }[];
  externalUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type LostFormProps =
  | {
      mode: "create";
      mutation: (data: LostFormState) => void;
      isPending?: boolean;
      submitText?: string;
    }
  | {
      mode: "update";
      initialData: Lost;
      mutation: (data: LostFormState) => void;
      isPending?: boolean;
      submitText?: string;
    };
export type LostCreateRequest = {
  title: string;
  description: string;
  location: string;
  foundDate: string;
  thumbnail?: File;
  detailImages?: File[];
};
export type LostUpdateRequest = {
  title: string;
  description: string;
  location: string;
  foundDate: string;
  thumbnail: File | null;
  exists: ImageItem[];
  deletes: string[];
  newImages: File[];
  imageIndexs: number[];
};
export type LostFormState = {
  title: string;
  description: string;
  location: string;
  foundDate: string;
  
  thumbnail: File | null;            // 새로 선택한 썸네일
  existingThumbnailUrl?: string | null;     // update 전용
  
  detailImages: FormImageListItem[];
};