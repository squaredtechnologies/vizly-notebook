import { create } from "zustand";
import {
	CHAT_PANEL_ID,
	FILESYSTEM_PANEL_ID,
} from "../../../utils/constants/constants";
import { useChatStore } from "../chat/store/ChatStore";

interface SidebarState {
	textInputRef: HTMLTextAreaElement | null;
	panelType: string;
	isExpanded: boolean;
	setTextInputRef: (textInputRef: HTMLTextAreaElement) => void;
	setPanelType: (panelType: string) => void;
	setIsExpanded: (isExpanded: boolean) => void;
	toggleOpen: () => void;
	openChat: () => void;
	openFileSystem: () => void;
	openChatAndSetSelection: (selection?: string) => void;
	initializeChat: (selection: string) => void;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
	textInputRef: null,
	panelType: FILESYSTEM_PANEL_ID, // replace FILESYSTEM_PANEL_ID with your constant
	isExpanded: false,
	setTextInputRef: (textInputRef: HTMLTextAreaElement) =>
		set(() => ({ textInputRef })),
	setPanelType: (panelType) => set(() => ({ panelType })),
	setIsExpanded: (isExpanded) => set(() => ({ isExpanded })),
	toggleOpen: () => {
		set((state) => {
			// If panel type isn't set and the sidebar is expanded via the chat, open the chat panel by default
			if (state.panelType === "" && state.isExpanded === false) {
				return { panelType: CHAT_PANEL_ID, isExpanded: true };
			}
			return { isExpanded: !state.isExpanded };
		});
	},
	openChat: () => {
		set((state) => {
			// Focus the text input box if the chat panel is open
			state.textInputRef?.focus();
			return { isExpanded: true, panelType: CHAT_PANEL_ID };
		});
	},
	openFileSystem: () => {
		set(() => ({
			isExpanded: true,
			panelType: FILESYSTEM_PANEL_ID,
		}));
	},
	openChatAndSetSelection: (selection?: string) => {
		if (selection) {
			useChatStore.getState().addChatContext(selection);
		}
		get().openChat();
		get().textInputRef?.focus();
	},
	initializeChat: (selection: string = "") => {
		const { askChatAssistant } = useChatStore.getState();
		set(() => ({
			isExpanded: true,
			panelType: CHAT_PANEL_ID,
		}));

		askChatAssistant(`${selection}`);
	},
}));
