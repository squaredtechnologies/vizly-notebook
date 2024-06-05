import { create } from "zustand";
import { useNotebookStore } from "../notebook/store/NotebookStore";
import { RefObject } from "react";
import { CellState, CellStatus } from "../cell/store/CellStore";

export enum MagicInputSelections {
	Generate = "Generate",
	Edit = "Edit",
	FollowUp = "Follow up",
	Chat = "Chat",
}

interface MagicInputStore {
	value: string;
	selectedCode: string;
	textareaRef: RefObject<HTMLTextAreaElement> | null;
	selectedOption: MagicInputSelections;
	availableSelections: MagicInputSelections[];
	setValue: (value: string) => void;
	setSelectedCode: (code: string) => void;
	handleQuery: (userQuery: string) => void;
	setTextareaRef: (textareaRef: RefObject<HTMLTextAreaElement>) => void;
	focusMagicInput: () => void;
	setSelectedOption: (option: MagicInputSelections) => void;
	setAvailableSelections: (options: MagicInputSelections[]) => void;
	updateStore: (notebookMode: string, cellState: CellState) => string[];
}

export const useMagicInputStore = create<MagicInputStore>((set, get) => ({
	value: "",
	selectedCode: "",
	textareaRef: null,
	selectedOption: MagicInputSelections.Edit,
	availableSelections: [
		MagicInputSelections.Generate,
		MagicInputSelections.Edit,
		MagicInputSelections.Chat,
	],
	setValue: (value: string) => {
		set({ value });
	},
	setSelectedCode: (code: string) => {
		set({ selectedCode: code });
	},
	handleQuery: async (userQuery: string) => {
		const { setValue } = get();
		const trimmedUserQuery = userQuery.trim();
		if (trimmedUserQuery.length === 0) return;
		setValue("");
		const { magicQuery } = useNotebookStore.getState();
		await magicQuery(trimmedUserQuery);
	},
	setTextareaRef: (textareaRef: RefObject<HTMLTextAreaElement>) => {
		set({ textareaRef });
	},
	focusMagicInput: () => {
		const { textareaRef } = get();
		if (textareaRef && textareaRef.current) {
			textareaRef.current.focus();
		}
	},
	setSelectedOption: (option: MagicInputSelections) => {
		set({ selectedOption: option });
	},
	setAvailableSelections: (options: MagicInputSelections[]) => {
		set({ availableSelections: options });
	},
	updateStore: (notebookMode: string, cellState: CellState) => {
		// Determine the new available selections
		let newSelections;
		if (cellState.status == CellStatus.FollowUp) {
			newSelections = [
				MagicInputSelections.FollowUp,
				MagicInputSelections.Chat,
			];
			get().setSelectedOption(MagicInputSelections.FollowUp);
		} else if (notebookMode === "command") {
			newSelections = [
				MagicInputSelections.Edit,
				MagicInputSelections.Generate,
				MagicInputSelections.Chat,
			];
		} else {
			newSelections = get().availableSelections;
		}
		get().setAvailableSelections(newSelections);

		// Check if the current selected option is part of the new selections
		if (!newSelections.includes(get().selectedOption)) {
			// Reset selected option if it's not in the new available selections
			get().setSelectedOption(newSelections[0]); // Reset to the first available option, or use a default value
		}

		return newSelections;
	},
}));
