import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { HotkeysEvent } from "react-hotkeys-hook/dist/types";
import ConnectionManager from "../../../services/connection/connectionManager";
import {
	enableCommandMode,
	enableEditMode,
	runCell,
	runCellAndAdvance,
} from "../../cell/actions/actions";
import { useMagicInputStore } from "../../input/MagicInputStore";
import { useSidebarStore } from "../../sidebar/store/SidebarStore";
import { useNotebookStore } from "../store/NotebookStore";

/**
 * Custom hook to detect a double press of a specific key.
 *
 * @param key - The key to listen for double presses.
 * @param callback - The function to call on a double press.
 * @param delay - Maximum allowed time between presses in milliseconds. Defaults to 500.
 */
const useHotkeysDoublePress = (
	key: string,
	callback: () => void,
	delay: number = 500,
): void => {
	const [lastKeyPressTime, setLastKeyPressTime] = useState<number>(0);

	useHotkeys(key, () => {
		const currentTime = new Date().getTime();
		if (currentTime - lastKeyPressTime <= delay) {
			callback();
		}
		setLastKeyPressTime(currentTime);
	});
};

export const useNotebookHotkeys = () => {
	const notebookMode = () => useNotebookStore.getState().notebookMode;
	const activeCellIndex = () => useNotebookStore.getState().activeCellIndex;
	const getActiveCell = () => useNotebookStore.getState().getActiveCell;
	const cells = () => useNotebookStore.getState().cells;
	const setActiveCell = useNotebookStore.getState().setActiveCell;
	const addCellAtIndex = useNotebookStore.getState().addCellAtIndex;
	const deleteActiveCell = useNotebookStore.getState().deleteActiveCell;
	const clampIndex = useNotebookStore.getState().clampIndex;

	// Define hotkeys for 'command' mode
	useHotkeys("enter", (event: KeyboardEvent, hotkeysEvent: HotkeysEvent) => {
		if (notebookMode() === "command") {
			event.preventDefault();
			event.stopPropagation();

			enableEditMode();
		}
	});

	useHotkeys(
		"arrowup",
		(event: KeyboardEvent, hotkeysEvent: HotkeysEvent) => {
			if (notebookMode() === "command") {
				event?.preventDefault();
				const cellIndex = activeCellIndex();
				const clampedIndex = clampIndex(cellIndex - 1);
				const cell = cells()[clampedIndex];
				setActiveCell(cell.id as string);
			}
		},
	);

	useHotkeys(
		"arrowdown",
		(event: KeyboardEvent, hotkeysEvent: HotkeysEvent) => {
			if (notebookMode() === "command") {
				event?.preventDefault();
				const cellIndex = activeCellIndex();
				const clampedIndex = clampIndex(cellIndex + 1);
				const cell = cells()[clampedIndex];
				setActiveCell(cell.id as string);
			}
		},
	);

	useHotkeys("a", () => {
		if (notebookMode() === "command") {
			addCellAtIndex(activeCellIndex());
		}
	});

	useHotkeys("b", () => {
		if (notebookMode() === "command") {
			addCellAtIndex(activeCellIndex() + 1);
		}
	});

	useHotkeysDoublePress(
		"d",
		() => {
			if (notebookMode() === "command") {
				deleteActiveCell();
			}
		},
		250,
	);

	// Define hotkeys for 'edit' mode
	useHotkeys("escape", (event: KeyboardEvent, hotkeysEvent: HotkeysEvent) => {
		if (notebookMode() === "edit") {
			enableCommandMode();
		}
	});

	useHotkeys(
		"ctrl+enter",
		(event: KeyboardEvent, hotkeysEvent: HotkeysEvent) => {
			runCell();
		},
	);

	useHotkeys(
		"shift+enter",
		(event: KeyboardEvent, hotkeysEvent: HotkeysEvent) => {
			runCellAndAdvance();
		},
	);

	useHotkeys(
		"mod+enter",
		(event: KeyboardEvent, hotkeysEvent: HotkeysEvent) => {
			runCell();
		},
	);

	useHotkeysDoublePress(
		"i",
		() => {
			ConnectionManager.getInstance().kernel?.interrupt();
		},
		250,
	);

	// Define hotkeys for 'spotlight' search
	useHotkeys("mod+k", (event: KeyboardEvent, hotkeysEvent: HotkeysEvent) => {
		event.stopPropagation();
		event.preventDefault();
		useMagicInputStore.getState().focusMagicInput();
	});

	// Define hotkeys for undo + redo
	useHotkeys("mod+z", (event: KeyboardEvent, hotkeysEvent: HotkeysEvent) => {
		if (notebookMode() === "command") {
			const { undo } = useNotebookStore.temporal.getState();
			undo();
		}
	});

	useHotkeys("mod+b", (event: KeyboardEvent, hotkeysEvent: HotkeysEvent) => {
		const { isExpanded, setIsExpanded } = useSidebarStore.getState();
		setIsExpanded(!isExpanded);
	});

	useHotkeys(
		"mod+shift+z",
		(event: KeyboardEvent, hotkeysEvent: HotkeysEvent) => {
			if (notebookMode() === "command") {
				const { redo } = useNotebookStore.temporal.getState();
				redo();
			}
		},
	);
};
