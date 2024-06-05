export const getAction = (action: any) => {
	if (action && action.action && action.action.type) {
		return action.action.type;
	} else if (action && action.type) {
		return action.type;
	} else if (action && action.action) {
		return action.action;
	} else {
		return action;
	}
};

export const getActionInfo = (action: any) => {
	let obj: any = action;
	if (
		action &&
		action.action &&
		action.action.type &&
		typeof action.action.type == "string"
	) {
		obj = action.action;
	}
	const keys = Object.keys(obj);
	const filteredKeys = keys.filter((key) => {
		return key !== "type" && key !== "reason" && key != "action";
	});
	const actionInfo = filteredKeys.reduce(
		(acc: { [key: string]: any }, key) => {
			if (Array.isArray(obj[key])) {
				acc[key] = obj[key].join(", ");
			} else if (obj[key] && typeof obj[key] === "object") {
				acc[key] = getActionInfo(obj[key]);
			} else {
				acc[key] = obj[key];
			}
			return acc;
		},
		{},
	);
	return actionInfo;
};
