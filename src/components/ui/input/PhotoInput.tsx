// src/components/ui/input/PhotoInput.tsx
import { useCallback, useState } from "react";
import { Upload, X } from "lucide-react";

interface PhotoInputProps {
  onFileSelect: (file: File | null) => void;
  className?: string;
  maxSizeMB?: number;
  accept?: string;
  multiple?: boolean;
}

export const PhotoInput = ({
  onFileSelect,
  className = "",
  maxSizeMB = 5,
  accept = "image/*",
  multiple = false,
}: PhotoInputProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(
    (file: File) => {
      if (!file) return;

      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`);
        return;
      }

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }

      onFileSelect(file);
    },
    [maxSizeMB, onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) handleFileChange(file);
    },
    [handleFileChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <div
      className={`
        relative w-full h-48 border border-gray rounded-lg 
        flex flex-col items-center justify-center cursor-pointer 
        max-w-[400px]
        transition-colors ${className} text-gray
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-upload")?.click()}
    >
      <input
        id="file-upload"
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleInputChange}
      />

      {preview ? (
        <div className="relative w-full h-full">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-contain rounded-md"
          />
          <button
            type="button"
            onClick={clearFile}
            className="absolute top-[8px] right-[8px] bg-red-500 text-gray rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center text-gray">
          <Upload size={24} className="mb-2" />
          <p className="text-sm">클릭하거나 드래그하여 파일을 업로드해주세요.</p>
        </div>
      )}
    </div>
  );
};