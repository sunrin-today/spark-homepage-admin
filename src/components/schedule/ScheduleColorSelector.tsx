"use client";

import { useState, useRef, useEffect } from "react";
import { useFloating, offset, shift, useClick, useDismiss, useInteractions } from "@floating-ui/react";

const COLORS = [
  { name: "학생회", key: "council" },
  { name: "정보보호과", key: "infosec" },
  { name: "소프트웨어과", key: "software" },
  { name: "아이티경영과", key: "itmanagement" },
  { name: "콘텐츠디자인과", key: "contentsdesign" },
];

interface ScheduleColorSelectorProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export default function ScheduleColorSelector({
  selectedColor,
  onColorSelect,
}: ScheduleColorSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-start",
    middleware: [offset(8), shift()],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  return (
    <div className="relative">
      <button
        type="button"
        ref={refs.setReference}
        {...getReferenceProps()}
        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-transform hover:scale-110 focus:outline-none"
        style={{ backgroundColor: selectedColor }}
      />

      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="z-50 bg-white rounded-xl border border-[#DEDEDE] p-3 w-[205px]"
        >
          <div className="text-sm text-[#767676] mb-2 font-regular">
            학과 선택
          </div>
          <div className="-mx-3 mb-2 border-b border-[#E5E5E5]" />
          <div className="space-y-1">
            {COLORS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  onColorSelect(item.key);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-left"
              >
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.key }}
                />
                <span className="text-base text-black font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}