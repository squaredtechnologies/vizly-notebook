import { create } from "zustand";

interface FileViewModalState {
	file: File | null;
	setFile: (file: File | null) => void;
	showFileViewModal: boolean;
	setShowFileViewModal: (show: boolean) => void;
}

export const useFileViewModalState = create<FileViewModalState>((set) => ({
	file: null,
	setFile: (file: File | null) => set({ file, showFileViewModal: true }),
	showFileViewModal: false,
	setShowFileViewModal: (show: boolean) => {
		set({ showFileViewModal: show });

		if (show === false) {
			set({ file: null });
		}
	},
}));
