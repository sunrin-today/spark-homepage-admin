import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ModalPortal } from './ModalPortal';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
};

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  className = '',
}: ModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <ModalPortal onClose={onClose}>
      <div 
        className={`bg-white w-full ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </ModalPortal>,
    document.body
  );
}
