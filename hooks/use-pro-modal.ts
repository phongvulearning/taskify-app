import { create } from "zustand";

type CardProModalProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useProModalStore = create<CardProModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
