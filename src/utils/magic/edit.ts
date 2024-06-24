import { handleCellEdit } from "shared-thread-utils";
import useCellStore, {
	CellStatus,
} from "../../components/cell/store/CellStore";
import { useNotebookStore } from "../../components/notebook/store/NotebookStore";
import { useSettingsStore } from "../../components/settings/SettingsStore";
import ConnectionManager from "../../services/connection/connectionManager";
import { ThreadCell } from "../../types/code.types";
import { mostRelevantCellsForQuery } from "../embeddings";
import { makeStreamingFunctionRequest, parseStreamWrapper } from "../streaming";
import { getAppTheme, multilineStringToString } from "../utils";

const { getServerProxyUrl } = useSettingsStore.getState();

export const editCell = async (cell: ThreadCell, query: string) => {
	const setPreviousQuery = useCellStore.getState().setPreviousQuery;
	const setProposedSource = useCellStore.getState().setProposedSource;
	const setCellStatus = useCellStore.getState().setCellStatus;
	setCellStatus(cell.id as string, CellStatus.Generating);

	const isLocal = useSettingsStore.getState().isLocal();
	const payload = {
		userRequest: query,
		currentCellSource: multilineStringToString(cell.source),
		currentNamespace: ConnectionManager.getInstance().currentNamespace,
		mostRelevantCellsForQuery: await mostRelevantCellsForQuery(query),
		theme: getAppTheme(),
		...useSettingsStore.getState().getAdditionalRequestMetadata(),
	};

	const stream = isLocal
		? parseStreamWrapper({
				streamGenerator: handleCellEdit,
				params: payload,
		  })
		: makeStreamingFunctionRequest({
				url: `${getServerProxyUrl()}/api/magic/actions/editCell`,
				method: "POST",
				payload: payload,
				shouldCancel: () =>
					useNotebookStore.getState().userAbortedMagicQueryController
						.signal.aborted,
		  });

	for await (let data of stream) {
		data = data.trim();
		if (data.startsWith("0:")){
			const trimmedData = data.replace(/^```|```$/g, "");
			setProposedSource(cell.id as string, trimmedData);
		} else if (data.startsWith("9:")) {
			console.log("data:", data);
			let jsonifiedData = JSON.parse(data.slice(2).replace(/\n/g, "\\n"));
			const source = jsonifiedData.args.source.replace(/^```|```$/g, "");
			setProposedSource(cell.id as string, source);
		} else {
			throw new Error("Unexpected data format");
		}
	}

	setPreviousQuery(cell.id as string, query);
	setCellStatus(cell.id as string, CellStatus.FollowUp);
};
