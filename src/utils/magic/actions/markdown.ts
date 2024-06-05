import { ActionState } from "../magicQuery";
import { sharedAction } from "./shared/utils";

export async function* markdownAction(
	actionState: ActionState,
	wasAborted: () => boolean,
): AsyncGenerator<any, void, unknown> {
	yield* sharedAction(
		actionState,
		wasAborted,
		"http://localhost:5001/api/magic/actions/markdown",
		"markdwon",
	);
}
