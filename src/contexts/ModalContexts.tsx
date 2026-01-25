"use client";
import { createContext, useContext, useState } from "react";

const ModalContext = createContext<{
  open: (modal: React.ReactNode) => void;
  close: () => void;
} | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<React.ReactNode>(null);

  return (
    <ModalContext.Provider
      value={{
        open: setModal,
        close: () => setModal(null),
      }}
    >
      {children}
      {modal}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}
