// components/image/ImageBox.tsx
import { Upload, X } from "lucide-react";

interface ImageBoxProps {
  preview?: string | null;
  onClick?: () => void;
  onRemove?: () => void;
}

export function ImageBox({ preview, onClick, onRemove }: ImageBoxProps) {
  return (
    <div
      className="
        relative w-full h-56 border border-inputborder rounded-lg overflow-hidden
        flex items-center justify-center cursor-pointer
        hover:bg-[#DDDDDD] hover:border-dashed hover:border-darkgray hover:border-[1.5px]
      "
      onClick={onClick}
    >
      {preview ? (
        <div
          className="absolute inset-0 bg-cover bg-center text-white"
          style={{ backgroundImage: `url(${preview})` }}
        >
          <div className="absolute inset-0 bg-black/60 flex flex-col gap-2 items-center justify-center ">
            <Upload size={24} />
            <p className="text-sm font-medium">클릭하거나 드래그하여 파일을 업로드해주세요.</p>
          </div>

          {onRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute top-2 right-2"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <div className="text-gray flex flex-col gap-2 items-center">
          <Upload size={24} />
          <p className="text-sm font-medium">클릭하거나 드래그하여 파일을 업로드해주세요.   </p>
        </div>
      )}
    </div>
  );
}
