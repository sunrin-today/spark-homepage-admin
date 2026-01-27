import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface TextareaInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxLength?: number;
  name?: string;
  showCounter?: boolean;
  required?: boolean;
  className?: string;
}

export const TextareaInput = ({ 
  value, 
  onChange, 
  placeholder, 
  maxLength = 500,
  name,
  showCounter = true,
  required = false,
  className = "",
}: TextareaInputProps) => {
  const [charCount, setCharCount] = useState(value.length);

  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (maxLength && e.target.value.length > maxLength) {
      return;
    }
    onChange(e.target.value);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <textarea 
        className="w-full h-full bg-white border border-inputborder rounded-lg py-4 px-5 pr-[40px] pb-10
        resize-none outline-none hover:border-[#565656] focus:border-[#565656] focus:ring-0 text-base font-medium
        placeholder:text-gray"
        value={value} 
        onChange={handleChange} 
        placeholder={placeholder}
        maxLength={maxLength}
        name={name}
        id={name}
        required={required}
      />
      { value.length > 0 && (
        <X 
          size={20} 
          className="absolute top-4 right-4 text-gray cursor-pointer" 
          onClick={() => onChange("")}
        />
      )}
      {showCounter && (
        <div className="absolute bottom-4 right-4 text-md text-[#767676]">
          {charCount}/{maxLength}
        </div>
      )}
    </div>
  );
};