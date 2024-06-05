import { standaloneToast } from "../../theme";

export const triggerCellActionFailureToast = (
	type: "addition" | "deletion",
) => {
	let title = `Could not ${type === "addition" ? "add" : "delete"} cell`;
	let description = `Cells cannot be ${
		type === "addition" ? "added" : "deleted"
	} while cells are being generated.`;

	standaloneToast({
		title,
		description,
		status: "error",
		duration: 3000,
		containerStyle: {
			fontFamily: "Space Grotesk",
			maxWidth: "400px",
		},
		isClosable: true,
	});
};
