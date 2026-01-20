"use client";

import { EllipsisVertical, Ellipsis } from "lucide-react";
import { createPortal } from "react-dom";
import { useState } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useDismiss,
  useInteractions,
} from "@floating-ui/react";
import ActionBar, { ActionBarItem } from "./ActionBar";

type Props = {
  title?: string;
  items: ActionBarItem[];
  vertical?: boolean;
};

export default function ActionBarTrigger({
  title = "액션",
  items,
  vertical = false,
}: Props) {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-end",
    middleware: [offset(4), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {vertical ? (
          <EllipsisVertical
            className="w-5 h-5 cursor-pointer text-gray"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
          />
        ) : (
          <Ellipsis
            className="w-5 h-5 cursor-pointer text-gray"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
          />
        )}
      </div>

      {open &&
        createPortal(
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, zIndex: 9999, width: 200 }}
            {...getFloatingProps()}
          >
            <ActionBar title={title} items={items} />
          </div>,
          document.body
        )}
    </>
  );
}
