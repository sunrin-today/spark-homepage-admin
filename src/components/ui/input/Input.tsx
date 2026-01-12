import React, { forwardRef } from "react";
import { X } from "lucide-react";
interface BaseInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  name?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  onClick?: () => void; // DateInput 등 특수 클릭 이벤트
  readOnly?: boolean;
}
// 예시
/*
<InputWrapper label="제목" htmlFor="title">
    <BaseInput
    name="title"
    value={formData.title}
    onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
    placeholder="이벤트 제목을 입력해주세요"
    />
</InputWrapper>
*/
const BaseInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, BaseInputProps>(
  ({ leftIcon, rightIcon, value, name, onChange, placeholder, className, onClick, readOnly }, ref) => {
    return (
      <div
        className={`flex items-center px-[20px] py-[16px] border border-gray text-gray rounded-[12px] max-w-[400px] w-full min-w-0 focus-within:border-2 focus-within:border-gray focus-within:ring-0 ${className}`}
        onClick={onClick}
      >
        {leftIcon && <span className="flex-shrink-0 mr-2">{leftIcon}</span>}

        <div className="flex-1 min-w-0">
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            type="text"
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full outline-none focus:outline-none text-black bg-white"
            readOnly={readOnly}
          />
        </div>
        {value && <span className="flex-shrink-0 ml-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); onChange("") }}><X size={20} /></span>}
      </div>
    );
  }
);

export default BaseInput;
