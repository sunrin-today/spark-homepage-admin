"use client";
import { createContext, useContext, useState } from "react";

type ModalContextType = {
  open: (modal: React.ReactNode) => void;
  close: () => void;
  closeAll: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = useState<React.ReactNode[]>([]);

  const open = (modal: React.ReactNode) => {
    setModals((prev) => [...prev, modal]);
  };

  const close = () => {
    setModals((prev) => prev.slice(0, -1));
  };

  const closeAll = () => {
    setModals([]);
  };

  return (
    <ModalContext.Provider value={{ open, close, closeAll }}>
      {children}
      {modals.map((modal, index) => (
        <div key={index}>{modal}</div>
      ))}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}
