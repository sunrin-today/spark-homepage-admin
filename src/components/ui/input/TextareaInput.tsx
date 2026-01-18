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
}

export const TextareaInput = ({ 
  value, 
  onChange, 
  placeholder, 
  maxLength = 500,
  name,
  showCounter = true,
  required = false
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
    <div className="relative max-w-[400px]">
      <textarea 
        className="w-full h-40 bg-white border border-gray rounded-lg py-[16px] px-[20px] pr-[60px]
        resize-none outline-none focus:border-2 focus:border-gray focus:ring-0"
        value={value} 
        onChange={handleChange} 
        placeholder={placeholder}
        maxLength={maxLength}
        name={name}
        required={required}
      />
      { value.length > 0 && (
        <X size={20} className="absolute top-[20px] text-gray right-[20px] cursor-pointer" onClick={() => onChange("")}/>
      )}
      {showCounter && (
        <div className="absolute bottom-[-20px] right-2 text-md text-gray-400">
          {charCount}/{maxLength}
        </div>
      )}
    </div>
  );
};