import { useNotebookStore } from "../../notebook/store/NotebookStore";
import useCellStore from "../store/CellStore";

export const runCell = (): boolean => {
	useNotebookStore.getState().executeSelectedCells();
	return true;
};

export const runCellAndAdvance = (): boolean => {
	useNotebookStore.getState().executeSelectedCellsAndAdvance();
	return true;
};

export const enableCommandMode = (): boolean => {
	useNotebookStore.getState().setNotebookMode("command");
	return true;
};

export const enableEditMode = (): boolean => {
	useNotebookStore.getState().setNotebookMode("edit");
	return true;
};

export const rejectProposedSource = (cellId: string) => {
	const { rejectProposedSource } = useCellStore.getState();
	rejectProposedSource(cellId);
};

export const acceptProposedSource = (cellId: string) => {
	const { acceptProposedSource } = useCellStore.getState();
	acceptProposedSource(cellId);
};

export const acceptAndRunProposedSource = (cellId: string) => {
	const { acceptProposedSource } = useCellStore.getState();
	acceptProposedSource(cellId);
	useNotebookStore.getState().executeCell(cellId);
};
