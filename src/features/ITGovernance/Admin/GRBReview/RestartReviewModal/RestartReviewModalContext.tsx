// src/contexts/ModalContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ModalContextValue {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export function useRestartReviewModal(): ModalContextValue {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      'useRestartReviewModal must be used within a ModalProvider'
    );
  }
  return context;
}
