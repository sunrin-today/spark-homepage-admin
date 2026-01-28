// components/image/SortableImageItem.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SingleImageField } from "@/components/ui/input/SingleImageInput";
import { FormImageListItem } from "@/lib/types/common";

interface Props {
  image: FormImageListItem;
  onChange: (file: File) => void;
  onRemove: () => void;
}

export function SortableImageItem({ image, onChange, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
    >
      <SingleImageField
        preview={image.type === "new" ? image.preview : image.url}
        onChange={onChange}
        onRemove={onRemove}
      />
    </div>
  );
}
