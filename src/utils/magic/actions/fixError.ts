import { useSettingsStore } from "../../../components/settings/SettingsStore";
import { ActionState } from "../magicQuery";
import { sharedAction } from "./shared/utils";

const { getServerProxyURL } = useSettingsStore.getState();

export async function* fixErrorAction(
	actionState: ActionState,
	wasAborted: () => boolean,
): AsyncGenerator<any, void, unknown> {
	yield* sharedAction(
		actionState,
		wasAborted,
		`${getServerProxyURL()}/api/magic/actions/fixError`,
		"code",
	);
}
