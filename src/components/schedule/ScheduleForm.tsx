"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";
import { InputWrapper } from "@/components/ui/input/InputWrapper";
import { DateInput } from "@/components/ui/input/DateInput";
import { TextareaInput } from "@/components/ui/input/TextareaInput";
import ScheduleColorSelector from "./ScheduleColorSelector";

interface ScheduleFormData {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  color: string;
}

interface ScheduleFormProps {
  initialData?: ScheduleFormData;
  onSubmit: (data: ScheduleFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export default function ScheduleForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "추가",
}: ScheduleFormProps) {
  const [formData, setFormData] = useState<ScheduleFormData>(
    initialData || {
      title: "",
      startDate: "",
      endDate: "",
      description: "",
      color: "#FDC019",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputWrapper label="제목" htmlFor="title" className="max-w-[400px]">
        <div className="flex items-center gap-3 px-[20px] h-[54px] border bg-white border-inputborder rounded-[12px] w-full min-w-0 focus-within:border-black hover:border-[#565656]">
          
          <div className="flex items-center justify-center shrink-0">
            <ScheduleColorSelector
              selectedColor={formData.color}
              onColorSelect={(color) =>
                setFormData((prev) => ({ ...prev, color }))
              }
            />
          </div>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="제목을 입력하세요..."
            className="flex-1 min-w-0 outline-none focus:outline-none placeholder:text-[#767676] placeholder:text-base bg-white text-base font-medium h-full leading-none"
            required
          />

          {formData.title && (
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, title: "" }))
              }
              className="flex-shrink-0 text-gray cursor-pointer flex items-center justify-center"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </InputWrapper>

      <div className="grid grid-cols-2 gap-[10px] max-w-[810px]">
        <InputWrapper label="시작일" htmlFor="startDate">
          <DateInput
            name="startDate"
            value={formData.startDate}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, startDate: value }))
            }
            placeholder="날짜를 선택해주세요..."
          />
        </InputWrapper>

        <InputWrapper label="종료일" htmlFor="endDate">
          <DateInput
            name="endDate"
            value={formData.endDate}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, endDate: value }))
            }
            placeholder="날짜를 선택해주세요..."
          />
        </InputWrapper>
      </div>

      <InputWrapper label="설명" htmlFor="description" className="max-w-[400px]">
        <TextareaInput
          name="description"
          className="h-[294px] max-h-[294px]"
          value={formData.description}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, description: value }))
          }
          placeholder="내용을 입력하세요..."
          maxLength={300}
          required
        />
      </InputWrapper>

      <div className="flex justify-end gap-3 pt-4 text-sm font-medium">
        <button
          type="button"
          onClick={onCancel}
          className="px-2 py-1.5 rounded-lg text-gray hover:bg-gray/10 flex items-center gap-2 transition-colors"
        >
          <X size={20} />
          취소
        </button>

        <button
          type="submit"
          className="px-2 py-1.5 bg-black text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Save size={20} />
          {submitLabel}
        </button>
      </div>
    </form>
  );
}