// components/image/SingleImageField.tsx
import { useRef, useState } from "react";
import { ImageBox } from "../../image/ImageBox";
export function SingleImageField({
  preview,
  onChange,
  onRemove,
  name,
  maxW = "400px",
  height,
}: {
  preview: string | null;
  onChange: (file: File) => void;
  onRemove: () => void;
  name?: string;
  maxW?: string;
  height?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false); 
  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
        onChange(file);
      }
    };
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onChange(file);
      }
    };
  return (
    <div 
      style={{ maxWidth: maxW }} 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}>
      <input
        id={name || "image"}
        name={name || "image"}
        ref={ref}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileInput}
      />
      <ImageBox
        preview={preview}
        onClick={() => ref.current?.click()}
        onRemove={onRemove}
        height={height}
      />  
      
    </div>
  );
}
