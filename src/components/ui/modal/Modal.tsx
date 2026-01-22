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
        className={`bg-white rounded-lg w-full max-w-md mx-4 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </ModalPortal>,
    document.body
  );
}
