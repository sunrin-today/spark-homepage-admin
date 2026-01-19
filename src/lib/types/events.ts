import { FormImageListItem, ImageItem } from "./common";

export interface Event {
  id: string;
  name: string;
  description: string;
  link: string;
  isLinkOn: boolean;
  startedAt: string;
  deadline: string;
  createdAt: string;
  thumbnail: ImageItem;
  detailImages: ImageItem[];
}

export interface EventCreateForm {
  name: string;
  description: string;
  startedAt: string;
  deadline: string;
  link: string;
  isLinkOn: boolean;
  thumbnail: File;
  detailImages: File[];
}

export interface EventUpdateForm {
  name: string;
  description: string;
  startedAt: string;
  deadline: string;
  link: string;
  isLinkOn: boolean;
  thumbnail: File | null;   // null = 유지 | File = 교체
  deletes: string[];      
  imageIndexes: number[];  
  exists: ImageItem[]; // 삭제할 기존 이미지 URL
  newImages: File[];        // 새로 추가한 이미지
}

export type EventFormProps =
  | {
      mode: "create";
      onSubmit: (data: EventCreateForm) => Promise<void>;
      submitText?: string;
    }
  | {
      mode: "update";
      initialData: Event; // 서버에서 받은 이벤트   
      onSubmit: (data: EventUpdateForm) => Promise<void>;
      submitText?: string;
    };
export type EventFormState = {
  name: string;
  description: string;
  startedAt: string;
  deadline: string;
  link: string;
  isLinkOn: boolean;

  thumbnail: File | null;            // 새로 선택한 썸네일
  existingThumbnailUrl?: string | null;     // update 전용

  detailImages: FormImageListItem[];
};