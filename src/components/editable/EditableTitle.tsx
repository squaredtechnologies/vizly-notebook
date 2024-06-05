import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import {
	ButtonGroup,
	Editable,
	EditableInput,
	EditablePreview,
	Flex,
	HStack,
	IconButton,
	useEditableControls,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { standaloneToast } from "../../theme";
import { isUrlSafe, makeUrlSafe } from "../../utils/utils";
import { useRouter } from "next/router";
import { useNotebookStore } from "../notebook/store/NotebookStore";

function EditableTitle({
	title,
	setTitle,
}: {
	title: string;
	setTitle: (
		newTitle: string,
	) => Promise<{ success: boolean; error: string | null }>;
}) {
	const router = useRouter();
	const { getKernelId } = useNotebookStore.getState();

	const [innerTitle, setInnerTitle] = useState(title);
	const [hovered, setHovered] = useState(false);

	useEffect(() => {
		setInnerTitle(title);
	}, [title]);

	const handleTitleSubmit = (newTitle: string) => {
		if (!newTitle.endsWith(".ipynb")) {
			newTitle += ".ipynb";
		}
		if (isUrlSafe(newTitle)) {
			setTitle(newTitle).then((result) => {
				if (result.error) {
					standaloneToast({
						title: "Error encountered when saving file",
						description:
							"Invalid name or file with that name already exists",
						status: "error",
						duration: 3000,
						isClosable: true,
					});
					setInnerTitle(title);
				} else {
					router.replace({
						pathname: router.pathname,
						query: {
							...router.query,
							path: newTitle,
						},
					});
				}
			});
		} else {
			// Show an error message to the user
			standaloneToast({
				title: "Invalid Title",
				description:
					"Title must only contain alphanumeric characters, hyphens, spaces, or underscores. Consider using: " +
					makeUrlSafe(newTitle),
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	// Custom controls to show edit buttons
	function EditableControls({ hovered }: { hovered: boolean }) {
		const {
			isEditing,
			getSubmitButtonProps,
			getCancelButtonProps,
			getEditButtonProps,
		} = useEditableControls();
		return isEditing ? (
			<ButtonGroup justifyContent="center" size="sm">
				<IconButton
					aria-label="Save"
					icon={<CheckIcon />}
					{...getSubmitButtonProps()}
				/>
				<IconButton
					aria-label="Close"
					icon={<CloseIcon />}
					{...getCancelButtonProps()}
				/>
			</ButtonGroup>
		) : (
			<Flex justifyContent="flex-end">
				<IconButton
					display={hovered ? "flex" : "none"}
					size="sm"
					icon={<EditIcon />}
					aria-label="Edit"
					{...getEditButtonProps()}
				/>
			</Flex>
		);
	}

	return (
		<Editable
			value={innerTitle}
			fontSize={["32px", "38px", "46px"]}
			fontWeight="700"
			placeholder="Untitled Notebook"
			letterSpacing="-0.01em"
			isTruncated
			onChange={(value) => {
				setInnerTitle(value);
			}}
			textTransform="none"
			fontFamily='"IBM Plex Sans", system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
			userSelect="text"
			width="100%"
			overflow="hidden"
			display="inline-block"
			lineHeight="inherit"
			whiteSpace="normal"
			overflowWrap="break-word"
			outline="none"
			padding="3px"
			borderRadius="3px"
			cursor="text"
			border="1px solid transparent"
			_hover={{
				opacity: 0.7,
				border: "1px dashed var(--chakra-colors-chakra-body-text)",
			}}
			_active={{
				boxShadow: "none",
			}}
			px="2"
			py="1"
			transition="0.2s"
			justifyContent={"center"}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			onSubmit={handleTitleSubmit}
		>
			<HStack
				gap={6}
				justifyContent={"space-between"}
				align={"center"}
				width="100%"
			>
				<EditablePreview isTruncated width="100%" />
				<EditableInput
					width="100%"
					_focusVisible={{
						boxShadow: "none",
					}}
				/>
				<EditableControls hovered={hovered} />
			</HStack>
		</Editable>
	);
}

export default EditableTitle;
