import { create } from "zustand";

interface ShortcutsModalState {
	showShortcutsModal: boolean;
	setShowShortcutsModal: (show: boolean) => void;
}

export const useShortcutsModalStore = create<ShortcutsModalState>((set) => ({
	showShortcutsModal: false,
	setShowShortcutsModal: (show: boolean) => set({ showShortcutsModal: show }),
}));
