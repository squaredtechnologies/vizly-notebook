import { useHotkeys } from "react-hotkeys-hook";
import {
	acceptAndRunProposedSource,
	acceptProposedSource,
	rejectProposedSource,
} from "./actions";

export const useCellHeaderHotkeys = (cellId: string) => {
	const handleAcceptAndRun = () => acceptAndRunProposedSource(cellId);
	const handleAccept = () => acceptProposedSource(cellId);
	const handleReject = () => rejectProposedSource(cellId);

	// Define hotkeys for 'command' mode
	useHotkeys("mod+shift+enter", handleAcceptAndRun, {}, [cellId]);
	useHotkeys("mod+enter", handleAccept, {}, [cellId]);
	useHotkeys("mod+backspace", handleReject, {}, [cellId]);
};
