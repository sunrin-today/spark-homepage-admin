import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

type ModalPortalProps = {
  children: ReactNode;
  onClose: () => void;
};

export function ModalPortal({ children, onClose }: ModalPortalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#010101] bg-opacity-60"
      onClick={onClose}
    >
      {children}
    </div>,
    document.body
  );
}
