export interface Event {
  id: string;
  name: string;
  description: string;
  link: string;
  isLinkOn: boolean;
  startedAt: string;
  deadline: string;
  createdAt: string;
  thumbnail: string;
  detailImages: string[];
}

interface EventFormData {
  name: string;
  description: string;
  startedAt: string;
  deadline: string;
  link: string;
  isLinkOn: boolean;
  thumbnail: File | null; 
  detailImages: (File | null)[];
}
export default EventFormData;