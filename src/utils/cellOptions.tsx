import { MarkdownIcon, PythonIcon, SparklesIcon } from "../assets/icons";

const cellTypeConfigs = [
	{ key: "code", icon: <PythonIcon />, label: "Python" },
	{ key: "markdown", icon: <MarkdownIcon />, label: "Markdown" },
];

export const getCellTypesWithHandlers = (
	handlerMapping: Record<string, () => void>,
) => {
	return cellTypeConfigs.map((cellTypeConfig) => {
		return {
			...cellTypeConfig,
			handler: handlerMapping[cellTypeConfig.key],
		};
	});
};
