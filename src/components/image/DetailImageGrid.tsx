// components/image/DetailImageGrid.tsx
"use client";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { SortableImageItem } from "./SortableImageItem";
import { SingleImageField } from "@/components/ui/input/SingleImageInput";
import { FormImageListItem } from "@/lib/types/common";

interface Props {   
  value: FormImageListItem[];
  onChange: (next: FormImageListItem[]) => void;
  max?: number;
  min?: number;
}

export function DetailImageGrid({
  value,
  onChange,
  max = 10,
  min = 0,
}: Props) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = value.findIndex(v => v.id === active.id);
    const newIndex = value.findIndex(v => v.id === over.id);

    onChange(arrayMove(value, oldIndex, newIndex));
  };

  const handleAdd = (file: File) => {
    if (value.length >= max) return;

    onChange([
      ...value,
      {
        id: crypto.randomUUID(),
        type: "new",
        file,
        preview: URL.createObjectURL(file),
      },
    ]);
  };

  const handleRemove = (id: string) => {
    onChange(value.filter(v => v.id !== id));
  };

  const emptySlots = max - value.length;

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={value.map(v => v.id)}
        strategy={rectSortingStrategy}
      >
        <div className="overflow-y-auto overflow-x-hidden w-full justify-center max-h-[500px]  grid grid-cols-1 lg:grid-cols-2 gap-4">
          {value.map(image => (
            <SortableImageItem
              key={image.id}
              image={image}
              onChange={(file) => {
                onChange(
                  value.map(v =>
                    v.id === image.id
                      ? {
                          id: image.id,
                          type: "new",
                          file,
                          preview: URL.createObjectURL(file),
                        }
                      : v
                  )
                );
              }}
              onRemove={() => handleRemove(image.id)}
            />
          ))}

          {/* 빈 슬롯 */}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <SingleImageField
              key={`empty-${i}`}
              preview={null}
              onChange={handleAdd}
              onRemove={() => {}}
            />
          ))}
        </div>

        {value.length < min && (
          <p className="text-sm text-red-500 mt-2">
            최소 {min}개의 이미지를 추가해주세요.
          </p>
        )}
      </SortableContext>
    </DndContext>
  );
}
