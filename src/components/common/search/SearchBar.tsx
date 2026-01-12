// components/common/search/SearchBar.tsx
import { Search } from "lucide-react";
import BaseInput from "@/components/ui/input/Input";
// import { Button } from "@/components/ui/button"; // Assuming you have a Button component

interface SearchBarProps {
  value: string;
  placeholder: string;
  buttonText?: string;
  onChangeText: (value: string) => void;
  onSubmit?: (searchTerm: string) => void;
  className?: string;
}

export const SearchBar = ({ 
  buttonText = "검색", 
  placeholder, 
  onChangeText, 
  onSubmit, 
  value,
  className = ""
}: SearchBarProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-2 w-full ${className}`}>
      
        <BaseInput
          leftIcon={<Search size={20} className="text-gray-400" />}
          placeholder={placeholder}
          value={value}
          onChange={onChangeText}
          className="w-full"
        />
      {buttonText && (
        <button
          type="submit" 
          className="whitespace-nowrap bg-[#2C2C2C] text-white rounded-[12px] px-[20px] py-[16px]"
        >
          {buttonText}
        </button>
      )}
    </form>
  );
};