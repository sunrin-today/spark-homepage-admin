import { Search } from "lucide-react";
import BaseInput from "@/components/ui/input/Input";

interface SearchBarProps {
  value: string;
  placeholder: string;
  buttonText?: string;
  onChangeText: (value: string) => void;
  onSubmit?: (searchTerm: string) => void;
  className?: string;
}

export const SearchBar = ({ 
  buttonText = "검색하기", 
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
          leftIcon={<Search size={20} />}
          placeholder={placeholder}
          value={value}
          onChange={onChangeText}
          className="max-w-[400px]"
        />
      {buttonText && (
        <button
          type="submit" 
          className="whitespace-nowrap bg-black text-white rounded-[12px] px-[20px] py-[12px]"
        >
          {buttonText}
        </button>
      )}
    </form>
  );
};