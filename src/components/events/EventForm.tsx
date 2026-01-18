"use client";

import { useState } from "react";
import { DateInput } from "@/components/ui/input/DateInput";
import { ImageInput } from "@/components/ui/input/ImageInput";
import { InputWrapper } from "@/components/ui/input/InputWrapper";
import { TextareaInput } from "@/components/ui/input/TextareaInput";
import BaseInput from "@/components/ui/input/Input";
import Toggle from "@/components/ui/input/Toggle";
import { X, File } from "lucide-react";
import { validateEventLink } from "@/utils/events";
import {EventFormState, EventFormProps} from "@/lib/types/events";
import { buildCreatePayload, buildUpdatePayload } from "@/utils/events";

export default function EventForm(props: EventFormProps) {

  const { mode, onSubmit, submitText = "저장" } = props;

  const [formData, setFormData] = useState<EventFormState>(() => {
    if (mode === "update") {
      const { initialData } = props;

      console.log("initialData", initialData);
      return {
        name: initialData.name,
        description: initialData.description,
        startedAt: initialData.startedAt,
        deadline: initialData.deadline,
        link: initialData.link,
        isLinkOn: initialData.isLinkOn ?? true,

        thumbnail: null, // 새로 선택 안 하면 null
        existingThumbnailUrl: initialData.thumbnail,

        detailImages: initialData.detailImages.map((url) => ({
          type: "exists",
          url,
        })),
      };
    }

    // create 모드
    return {
      name: "",
      description: "",
      startedAt: new Date().toISOString().split("T")[0],
      deadline: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      link: "",
      isLinkOn: false,

      thumbnail: null,
      detailImages: [],
    };
  });

  const setThumbnail = (file: File | null) => {
    setFormData(prev => ({ ...prev, thumbnail: file }));
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, existingThumbnailUrl: url }));
    }
    if (file===null) {
      setFormData(prev => ({ ...prev, existingThumbnailUrl: null }));
    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (
    date: string,
    field: "startedAt" | "deadline"
  ) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };
  
  const handleAddDetailImage = (file: File) => {
    setFormData(prev => ({
      ...prev,
      detailImages: [...prev.detailImages, { type: "new", file, preview: URL.createObjectURL(file) }],
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      detailImages: prev.detailImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.thumbnail && mode=="create") {
      alert("썸네일 이미지를 선택해주세요.");
      return;
    }

    if (formData.isLinkOn && !validateEventLink(formData.link)) {
      alert("유효하지 않은 링크입니다.");
      return;
    }
    if (mode === "create") {
        await onSubmit(buildCreatePayload(formData));
        return;
    }
    console.log(formData.isLinkOn);
    await onSubmit(
        buildUpdatePayload(formData, props.initialData.detailImages ?? [])
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputWrapper label="썸네일 이미지" htmlFor="thumbnail">
        <ImageInput 
            onFileSelect={setThumbnail}
            onFileRemove={() => setThumbnail(null)}
            preview={formData.existingThumbnailUrl || null} 
        />
      </InputWrapper>

      <InputWrapper label="이벤트 제목" htmlFor="name">
        <BaseInput
          name="name"
          value={formData.name}
          onChange={value =>
            handleInputChange({ target: { name: "name", value } } as any)
          }
          placeholder="이벤트 제목을 입력해주세요"
          required
        />
      </InputWrapper>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <InputWrapper label="시작일" htmlFor="startedAt">
          <DateInput
            value={formData.startedAt}
            onChange={date => handleDateChange(date, "startedAt")}
          />
        </InputWrapper>

        <InputWrapper label="종료일" htmlFor="deadline">
          <DateInput
            value={formData.deadline}
            onChange={date => handleDateChange(date, "deadline")}
          />
        </InputWrapper>
      </div>

      <InputWrapper label="링크 공개 여부" htmlFor="isLinkOn">
        <Toggle
          checked={formData.isLinkOn}
          onChange={checked =>
            setFormData(prev => ({ ...prev, isLinkOn: checked }))
          }
        />
      </InputWrapper>

      <InputWrapper label="이벤트 참여 링크" htmlFor="link">
        <BaseInput
          name="link"
          value={formData.link}
          onChange={value =>
            handleInputChange({ target: { name: "link", value } } as any)
          }
          placeholder="참여 링크를 입력해주세요"
          required={formData.isLinkOn}
        />
      </InputWrapper>

      <InputWrapper label="상세 이미지" htmlFor="detailImages">
        <div className="max-h-[400px] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <ImageInput
                key={index}
                onFileSelect={handleAddDetailImage}
                onFileRemove={() => handleRemoveImage(index)}
                preview={
                  formData.detailImages[index]?.type === "new"
                    ? formData.detailImages[index]?.preview
                    : formData.detailImages[index]?.url || null
                }
                required={index < 2}
              />
            ))}
          </div>
        </div>
      </InputWrapper>

      <InputWrapper label="이벤트 설명" htmlFor="description">
        <TextareaInput
          name="description"
          value={formData.description}
          onChange={value =>
            handleInputChange({
              target: { name: "description", value },
            } as any)
          }
          placeholder="이벤트 상세 설명을 입력해주세요"
          required
        />
      </InputWrapper>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-2 py-1.5 rounded-lg text-gray hover:bg-gray/10 flex items-center gap-2"
        >
          <X />
          취소
        </button>

        <button
          type="submit"
          className="px-2 py-1.5 bg-black text-white rounded-lg flex items-center gap-2"
        >
          <File />
          {submitText}
        </button>
      </div>
    </form>
  );
}
