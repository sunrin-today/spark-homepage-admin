"use client";

import { useState, useEffect } from "react";
import { DateInput } from "@/components/ui/input/DateInput";
import { SingleImageField } from "@/components/ui/input/SingleImageInput";
import { InputWrapper } from "@/components/ui/input/InputWrapper";
import { TextareaInput } from "@/components/ui/input/TextareaInput";
import BaseInput from "@/components/ui/input/Input";
import Toggle from "@/components/ui/input/Toggle";
import { X, File } from "lucide-react";
import { validateEventLink } from "@/utils/events";
import {EventFormState, EventFormProps} from "@/lib/types/events";
import { DetailImageGrid } from "@/components/image/DetailImageGrid";
import { FormImageListItem } from "@/lib/types/common";

export default function EventForm(props: EventFormProps) {

  const { mode, mutation, isPending, submitText = "저장", error } = props;

  const [formData, setFormData] = useState<EventFormState>(() => {
    if (mode === "update") {
      const { initialData } = props;

      return {
        name: initialData.name,
        description: initialData.description,
        startedAt: initialData.startedAt,
        deadline: initialData.deadline,
        link: initialData.link,
        isLinkOn: initialData.isLinkOn ?? true,

        thumbnail: null, // 새로 선택 안 하면 null
        existingThumbnailUrl: initialData.thumbnail.url,

        detailImages: initialData.detailImages.map((image) => ({
          type: "exists",
          url: image.url,
          id: crypto.randomUUID(),
        })),
      };
    }

    // create 모드
    return {
      name: "",
      description: "",
      startedAt: new Date().toISOString().split("T")[0],
      deadline: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000 // 일주일 뒤
      )
        .toISOString()
        .split("T")[0],
      link: "",
      isLinkOn: false,

      thumbnail: null,
      detailImages: [],
    };
  });
  
  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);
  
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
  
  const setDetailImages = (images: FormImageListItem[]) => {
    setFormData(prev => ({ ...prev, detailImages: images }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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
        mutation(formData);
        return;
    }
    mutation(formData);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-2 py-3">
      <InputWrapper label="썸네일 이미지" htmlFor="thumbnail" className="max-w-[400px]">
        <SingleImageField 
            name="thumbnail"
            onChange={setThumbnail}
            onRemove={() => setThumbnail(null)}
            preview={formData.existingThumbnailUrl || null} 
        />
      </InputWrapper>
      <InputWrapper label="제목" htmlFor="name" className="max-w-[400px]">
        <BaseInput
          name="name"
          value={formData.name}
          onChange={value =>
            handleInputChange({ target: { name: "name", value } } as React.ChangeEvent<HTMLInputElement>)
          }
          placeholder="이벤트 제목을 입력해주세요"
          required
        />
      </InputWrapper>
      
      <div className="flex flex-col xl:flex-row gap-6">
        <InputWrapper label="시작일" htmlFor="startedAt" className="max-w-[400px]">
          <DateInput
            name="startedAt"
            value={formData.startedAt}
            onChange={date => handleDateChange(date, "startedAt")}
          />
        </InputWrapper>

        <InputWrapper label="종료일" htmlFor="deadline" className="max-w-[400px]">
          <DateInput
            name="deadline"
            value={formData.deadline}
            onChange={date => handleDateChange(date, "deadline")}
          />
        </InputWrapper>
      </div>

      <InputWrapper label="이벤트 참여 시작" htmlFor="isLinkOn" className="max-w-[400px]">
        <Toggle
          name="isLinkOn"
          checked={formData.isLinkOn}
          onChange={checked =>
            setFormData(prev => ({ ...prev, isLinkOn: checked }))
          }
        />
      </InputWrapper>

      <InputWrapper label="이벤트 참여 링크" htmlFor="link" className="max-w-[400px]">
        <BaseInput
          name="link"
          value={formData.link}
          onChange={value =>
            handleInputChange({ target: { name: "link", value } } as React.ChangeEvent<HTMLInputElement>)
          }
          placeholder="참여 링크를 입력해주세요"
          required={formData.isLinkOn}
        />
      </InputWrapper>

      <InputWrapper label="상세 이미지" className="max-w-[810px]">
        <DetailImageGrid
          value={formData.detailImages}
          onChange={setDetailImages}
        />
      </InputWrapper>

      <InputWrapper label="설명" htmlFor="description" className="max-w-[400px]">
        <TextareaInput
          name="description"
          value={formData.description}
          onChange={value =>
            handleInputChange({
              target: { name: "description", value },
            } as React.ChangeEvent<HTMLTextAreaElement>)
          }
          placeholder="이벤트 상세 설명을 입력해주세요"
          required
        />
      </InputWrapper>

      <div className="flex justify-end gap-3 pt-4 text-sm">
        {error ? <div className="text-error">{error}</div> : null}
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
          disabled={isPending}  
          className={`px-2 py-1.5
          ${isPending ? "bg-black/50 cursor-not-allowed" : "bg-black"}
          text-white rounded-lg flex items-center gap-2`}
        >
          <File />
          {submitText}
        </button>
      </div>
    </form>
  );
}
