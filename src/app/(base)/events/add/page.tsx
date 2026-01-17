"use client"
import { useState, useEffect } from "react";
import { DateInput } from "@/components/ui/input/DateInput";
import { PhotoInput } from "@/components/ui/input/PhotoInput";
import { InputWrapper } from "@/components/ui/input/InputWrapper";
import { TextareaInput } from "@/components/ui/input/TextareaInput";
import { X, File } from "lucide-react";
import BaseInput from "@/components/ui/input/Input";
import Toggle from "@/components/ui/input/Toggle";
import { validateEventLink } from "@/utils/events";
import eventsApi from "@/lib/api/events";
import EventFormData from "@/lib/types/events";
import { useRouter } from "next/navigation";
export default function EventsAdd() {
  const router = useRouter(); 
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    description: "",
    startedAt: new Date().toISOString().split('T')[0],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    link: "",
    isLinkOn: false,
    thumbnail: null as File | null,
    detailImages: Array(10).fill(null) as (File | null)[],
  });
  
  const setThumbnail = (file: File | null) => {
    setFormData(prev => ({ ...prev, thumbnail: file }));
  };

  // 폼 필드 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  // detailImages 배열의 특정 인덱스에 파일을 설정하는 함수
  const handleInputListChange = (file: File | null, index: number) => {
    setFormData(prev => {
      const copy = [...prev.detailImages];
      copy[index] = file; // file or null
      return { ...prev, detailImages: copy };
    });
  };
  const handleDateChange = (date: string, field: 'startedAt' | 'deadline') => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.thumbnail) {
      alert('썸네일 이미지를 선택해주세요.');
      return;
    }

    const isValid = validateEventLink(formData.link);
    if (!isValid) {
      console.log("Invalid link");
      return;
    }
    const compressedDetailImages = formData.detailImages.filter(
      (file): file is File => file !== null && file instanceof Object
    ) as File[];
    setFormData(prev => ({ ...prev, detailImages: compressedDetailImages }));

    const submitData = {
      ...formData,
      detailImages: compressedDetailImages,
    };
    try {
      const data = await eventsApi.createEvent(submitData);
      console.log('Event created:', data);
      router.push('/events');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };
  useEffect(() => {
    console.log("Form data:", formData);
  }, [formData]);
  return (
    <div className="w-full max-w-4xl px-8 py-12">
      <h1 className="text-2xl font-bold mb-8">이벤트 등록</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 썸네일 업로드 */}
        <InputWrapper label="썸네일 이미지" htmlFor="thumbnail">
          <PhotoInput 
            onFileSelect={setThumbnail} 
            maxSizeMB={5}
          />
        </InputWrapper>

        {/* 이벤트 제목 */}
        
        <InputWrapper label="이벤트 제목" htmlFor="name">
          <BaseInput
            name="name"
            value={formData.name}
            onChange={(value) => handleInputChange({ target: { name: 'name', value } } as any)}
            placeholder="이벤트 제목을 입력해주세요"
          />
        </InputWrapper>
        

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 시작일 */}
          <InputWrapper label="시작일" htmlFor="startedAt">
            <DateInput
              value={formData.startedAt}
              onChange={(date) => handleDateChange(date, 'startedAt')}
              placeholder="시작일을 선택해주세요"
            />
          </InputWrapper>

          {/* 종료일 */}
          <InputWrapper label="종료일" htmlFor="deadline">
            <DateInput
              value={formData.deadline}
              onChange={(date) => handleDateChange(date, 'deadline')}
              placeholder="종료일을 선택해주세요"
            />
          </InputWrapper>
        </div>
        
        <InputWrapper label="링크 공개 여부" htmlFor="isLinkOn">
        <Toggle 
        checked={formData.isLinkOn}
        onChange={(checked) => setFormData(prev => ({ ...prev, isLinkOn: checked }))}
        size="lg"
        color="success"
        />
        </InputWrapper>
        
        <InputWrapper label="이벤트 참여 링크" htmlFor="link">
          <BaseInput
            name="link"
            value={formData.link}
            onChange={(value) => handleInputChange({ target: { name: 'link', value } } as any)}
            placeholder="참여 링크를 입력해주세요"
          />
        </InputWrapper>
        <InputWrapper label="상세 이미지" htmlFor="detailImages">
          <div className="w-full max-h-[600px] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
              {Array.from({ length: Math.min(10, Math.max(4, formData.detailImages.length + (formData.detailImages.length % 2 === 0 ? 0 : 1))) }).map((_, index) => (
                <PhotoInput
                  key={index}
                  onFileSelect={(file) => handleInputListChange(file, index)}
                />
              ))}
            </div>
          </div>
        </InputWrapper>
        <InputWrapper label="이벤트 설명" htmlFor="description">
          <TextareaInput
            name="description"
            value={formData.description}
            onChange={(value) => handleInputChange({ target: { name: 'description', value } } as any)}
            placeholder="이벤트에 대한 상세 설명을 입력해주세요"
          />
        </InputWrapper>
        {/* 제출 버튼 */}
        <div className="flex justify-end gap-3 pt-4">
          {/* TODO : 컴포넌트화 시키기*/}
          <button
            type="button"
            className="px-2 py-1.5 rounded-lg text-gray hover:bg-gray/10 flex items-center gap-2"
            onClick={() => window.history.back()}
          >
            <X/>
            취소
          </button>
          <button
            type="submit"
            className="px-2 py-1.5 bg-black text-white rounded-lg hover:bg-gray/95 flex items-center gap-2"
          >
            <File/>
            저장
          </button>
        </div>
      </form>
    </div>
  );
}