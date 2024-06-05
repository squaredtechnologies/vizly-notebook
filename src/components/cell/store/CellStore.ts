import { create } from "zustand";
import { useNotebookStore } from "../../notebook/store/NotebookStore";

export enum CellStatus {
	Initial = "initial",
	Generating = "generating",
	FollowUp = "follow up",
}

export type CellState = {
	status: CellStatus;
	previousQuery?: string;
	proposedSource: string;
};

type CellStoreState = {
	cellStates: Record<string, CellState>;
	getCellState: (cellId: string) => CellState;
	setProposedSource: (cellId: string, proposedSource: string) => void;
	setCellStatus: (cellId: string, status: CellStatus) => void;
	acceptProposedSource: (cellId: string) => void;
	acceptAndRunProposedSource: (cellId: string) => void;
	rejectProposedSource: (cellId: string) => void;
	setPreviousQuery: (cellId: string, query: string) => void;
};

export const defaultCellState = {
	status: CellStatus.Initial,
	proposedSource: "",
};

const useCellStore = create<CellStoreState>((set, get) => ({
	cellStates: {},
	getCellState: (cellId) => {
		const cellStates = get().cellStates;
		// Check if the cellId exists in the cellStates record
		if (!cellStates[cellId]) {
			// If not, add the defaultCellState for that cellId
			set((storeState) => {
				const newState = { ...storeState.cellStates };
				newState[cellId] = defaultCellState;
				return { cellStates: newState };
			});
		}
		// Return the cell state for the given cellId (which now has defaultCellState if it didn't exist before)
		return get().cellStates[cellId];
	},
	setProposedSource: (cellId: string, proposedSource: string) => {
		set((storeState) => {
			const newState = { ...storeState.cellStates };
			newState[cellId] = {
				...newState[cellId],
				proposedSource: proposedSource,
			};
			return { cellStates: newState };
		});
	},
	setCellStatus: (cellId: string, status: CellStatus) => {
		set((storeState) => {
			const newState = { ...storeState.cellStates };
			newState[cellId] = {
				...newState[cellId],
				status: status,
			};
			return { cellStates: newState };
		});
	},
	acceptProposedSource: (cellId: string) => {
		const state = get();
		const setCellSource = useNotebookStore.getState().setCellSource;
		if (!state.cellStates[cellId]) {
			console.error(
				`Cell with id '${cellId}' does not exist in cellStates.`,
			);
			return;
		}
		const proposedSource = state.cellStates[cellId].proposedSource;
		setCellSource(cellId, proposedSource);
		state.setProposedSource(cellId, "");
		state.setCellStatus(cellId, CellStatus.Initial);
	},
	acceptAndRunProposedSource: (cellId: string) => {
		get().acceptProposedSource(cellId);
		useNotebookStore.getState().executeCell(cellId);
	},
	rejectProposedSource: (cellId: string) => {
		get().setProposedSource(cellId, "");
		get().setCellStatus(cellId, CellStatus.Initial);
	},
	setPreviousQuery(cellId, query) {
		set((storeState) => {
			const newState = { ...storeState.cellStates };
			newState[cellId] = {
				...newState[cellId],
				previousQuery: query,
			};
			return { cellStates: newState };
		});
	},
}));

export default useCellStore;
