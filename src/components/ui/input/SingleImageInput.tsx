// components/image/SingleImageField.tsx
import { useRef } from "react";
import { ImageBox } from "../../image/ImageBox";

export function SingleImageField({
  preview,
  onChange,
  onRemove,
  name,
  maxW = "400px",
}: {
  preview: string | null;
  onChange: (file: File) => void;
  onRemove: () => void;
  name?: string;
  maxW?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div style={{ maxWidth: maxW }}>
      <input
        id={name || "image"}
        name={name || "image"}
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
