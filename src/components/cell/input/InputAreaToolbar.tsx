import React, { useState } from "react";
import { HStack, Button, IconButton } from "@chakra-ui/react";
import {
	ArrowUpIcon,
	ArrowDownIcon,
	DeleteIcon,
	CheckIcon,
	CopyIcon,
} from "@chakra-ui/icons";
import { captureException } from "@sentry/nextjs";
import { useNotebookStore } from "../../notebook/store/NotebookStore";

interface InputAreaToolbarProps {
	active: boolean;
	source: boolean | string;
	index: number;
	cmRef: React.MutableRefObject<any>; // Add cmRef prop
}

const InputAreaToolbar: React.FC<InputAreaToolbarProps> = ({
	active,
	source,
	index,
	cmRef,
}) => {
	const defaultCopyButtonProps = {
		label: "Copy",
		icon: <CopyIcon />,
	};
	const [copyButtonProps, setCopyButtonProps] = useState<{
		label: string;
		icon: JSX.Element;
	}>(defaultCopyButtonProps);

	const copyCodeToClipboard = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		event.preventDefault();
		if (cmRef.current && cmRef.current.editor) {
			const content = cmRef.current.state?.doc.toString();
			if (content) {
				navigator.clipboard.writeText(content).then(
					() => {
						// Update button text to "Copied"
						setCopyButtonProps({
							label: "Copied",
							icon: <CheckIcon />,
						});

						setTimeout(() => {
							// Revert button text back to default after period of time
							setCopyButtonProps(defaultCopyButtonProps);
						}, 3000);
					},
					(err) => {
						captureException(err);
						console.error("Could not copy text: ", err);
					},
				);
			}
		}
	};

	return (
		active && (
			<HStack position="absolute" top={0} right={0} spacing={0}>
				<>
					<IconButton
						size="xs"
						aria-label="Move cell up"
						icon={<ArrowUpIcon />}
						onClick={(event) => {
							useNotebookStore.getState().moveCell("up");
							event.preventDefault();
							event.stopPropagation();
						}}
						variant="ghost"
						isDisabled={index === 0}
					/>
					<IconButton
						size="xs"
						aria-label="Move cell down"
						icon={<ArrowDownIcon />}
						onClick={(event) => {
							useNotebookStore.getState().moveCell("down");
							event.preventDefault();
							event.stopPropagation();
						}}
						variant="ghost"
						isDisabled={
							index ===
							useNotebookStore.getState().cells.length - 1
						}
					/>
					<IconButton
						size="xs"
						aria-label="Copy code"
						icon={copyButtonProps.icon}
						onClick={copyCodeToClipboard}
						variant="ghost"
						isDisabled={!source}
					/>
					<IconButton
						size="xs"
						aria-label="Delete cell"
						icon={<DeleteIcon />}
						onClick={(event) => {
							useNotebookStore.getState().deleteActiveCell();
							event.preventDefault();
							event.stopPropagation();
						}}
						variant="ghost"
					/>
				</>
			</HStack>
		)
	);
};

export default InputAreaToolbar;
