"use client";

import { useState, useEffect } from "react";
import { DateInput } from "@/components/ui/input/DateInput";
import { SingleImageField } from "@/components/ui/input/SingleImageInput";
import { InputWrapper } from "@/components/ui/input/InputWrapper";
import { TextareaInput } from "@/components/ui/input/TextareaInput";
import BaseInput from "@/components/ui/input/Input";
import { X, File } from "lucide-react";
import {LostFormState, LostFormProps} from "@/lib/types/losts";
import { DetailImageGrid } from "@/components/image/DetailImageGrid";
import { FormImageListItem } from "@/lib/types/common";
export default function LostForm(props: LostFormProps) {

  const { mode, mutation, isPending, submitText = "저장" } = props;

  const [formData, setFormData] = useState<LostFormState>(() => {
    if (mode === "update") {
      const { initialData } = props;

      console.log("initialData", initialData);
      return {
        title: initialData.title,
        description: initialData.description,
        location: initialData.location,
        foundDate: initialData.foundDate,
        status: initialData.status,
        thumbnail: null,
        existingThumbnailUrl: initialData.thumbnailUrl?.url || "",
        detailImages: initialData.detailImageUrls?.map((img) => ({
          type: "exists",
          url: img.url,
          id: crypto.randomUUID(),
        })) || [],
      };
    }

    // create 모드
    return {
      title: "",
      description: "",
      location: "",
      foundDate: new Date().toISOString().split("T")[0],
      status: "LOST",
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
    field: "foundDate"
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

    if (mode === "create") {
        mutation(formData);
        return;
    }
    mutation(formData);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-2 py-3">
      <InputWrapper label="썸네일 이미지" htmlFor="thumbnail" className="max-w-[351px]">
        <SingleImageField 
          height="351px"
          name="thumbnail"
          onChange={setThumbnail}
          onRemove={() => setThumbnail(null)}
          preview={formData.existingThumbnailUrl || null} 
        />
      </InputWrapper>

      <InputWrapper label="제목" htmlFor="title" className="max-w-[400px]">
        <BaseInput
          name="title"
          value={formData.title}
          onChange={value =>
            handleInputChange({ target: { name: "title", value } } as React.ChangeEvent<HTMLInputElement>)
          }
          placeholder="분실물 제목을 입력해주세요"
          required
        />
      </InputWrapper>
      <InputWrapper label="습득 장소" htmlFor="location" className="max-w-[400px]">
            <BaseInput
            name="location"
            value={formData.location}
            onChange={value =>
                handleInputChange({ target: { name: "location", value } } as React.ChangeEvent<HTMLInputElement>)
            }
            placeholder="습득 장소를 입력해주세요"
            required
            />
      </InputWrapper>

      <InputWrapper label="습득일" htmlFor="foundDate" className="max-w-[400px]">
        <DateInput
          name="foundDate"
          value={formData.foundDate}
          onChange={date => handleDateChange(date, "foundDate")}
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
          placeholder="분실물 상세 설명을 입력해주세요"
          required
        />
      </InputWrapper>

      <div className="flex justify-end gap-3 pt-4 text-sm">
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
