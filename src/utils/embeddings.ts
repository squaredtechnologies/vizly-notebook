import { ICell } from "@jupyterlab/nbformat";
import { PartialJSONArray, PartialJSONObject } from "@lumino/coreutils/types";

export const getCellEmbedding = (cell: ICell) => {
	if (
		cell.metadata &&
		cell.metadata["noterous"] &&
		(cell.metadata["noterous"] as PartialJSONObject)["embedding"]
	) {
		return (cell.metadata["noterous"] as PartialJSONObject)[
			"embedding"
		] as PartialJSONArray;
	}
	return undefined;
};

export const mostRelevantCellsForQuery = async (query: string, k = 5) => {
	return [];
};
