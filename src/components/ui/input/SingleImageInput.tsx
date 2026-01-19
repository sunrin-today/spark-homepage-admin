// components/image/SingleImageField.tsx
import { useRef } from "react";
import { ImageBox } from "../../image/ImageBox";

export function SingleImageField({
  preview,
  onChange,
  onRemove,
  maxW = "400px",
}: {
  preview: string | null;
  onChange: (file: File) => void;
  onRemove: () => void;
  maxW?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div style={{ maxWidth: maxW }}>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(file);
        }}
      />
      <ImageBox
        preview={preview}
        onClick={() => ref.current?.click()}
        onRemove={onRemove}
      />  
    </div>
  );
}
