"use client"
import { useState, useEffect } from "react";
import { DateInput } from "@/components/ui/input/DateInput";
import { PhotoInput } from "@/components/ui/input/PhotoInput";
import { InputWrapper } from "@/components/ui/input/InputWrapper";
import { TextareaInput } from "@/components/ui/input/TextareaInput";
import { X, File } from "lucide-react";
import BaseInput from "@/components/ui/input/Input";
import Toggle from "@/components/ui/input/Toggle";
export default function EventsAdd() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startedAt: "",
    deadline: "",
    thumbnail: null as File | null,
    detailImages: [] as File[],
    isActive: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: string, field: 'startedAt' | 'deadline') => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };
  useEffect(() => {
    console.log("Form data:", formData);
  }, [formData]);
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">이벤트 등록</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 썸네일 업로드 */}
        <InputWrapper label="썸네일 이미지" htmlFor="thumbnail">
          <PhotoInput 
            onFileSelect={(file) => handleInputChange({ target: { name: 'thumbnail', value: file } } as any)} 
            maxSizeMB={5}
          />
        </InputWrapper>

        {/* 이벤트 제목 */}
        
        <InputWrapper label="이벤트 제목" htmlFor="title">
          <BaseInput
            name="title"
            value={formData.title}
            onChange={(value) => handleInputChange({ target: { name: 'title', value } } as any)}
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
        <InputWrapper label="공개 여부" htmlFor="isPublic">
        <Toggle 
        checked={formData.isActive}
        onChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        size="sm"
        color="success"
        />
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
          <button
            type="button"
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            onClick={() => window.history.back()}
          >
            <X/>
            취소
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            <File/>
            저장
          </button>
        </div>
      </form>
    </div>
  );
}