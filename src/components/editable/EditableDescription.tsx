import {
	Editable,
	EditableInput,
	EditablePreview,
	HStack,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";

function EditableDescription({
	description,
	setDescription,
}: {
	description: string;
	setDescription: (
		newDescription: string,
	) => void | Dispatch<SetStateAction<string>>;
}) {
	const [hovered, setHovered] = useState(false);

	return (
		<Editable
			value={description}
			placeholder="Add a description..."
			// fontSize=""
			fontWeight="500"
			letterSpacing="-0.01em"
			onChange={(value) => setDescription(value)}
			textTransform="none"
			fontFamily="'IBM Plex Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
			userSelect="text"
			minWidth="50%"
			overflow="hidden"
			textOverflow="ellipsis"
			display="inline-block"
			// width="100%"
			maxWidth="1130px"
			lineHeight="inherit"
			whiteSpace="normal"
			overflowWrap="break-word"
			outline="none"
			borderRadius="3px"
			cursor="text"
			_hover={{
				opacity: 0.7,
				border: "1px dashed var(--chakra-colors-chakra-body-text)",
			}}
			_active={{
				boxShadow: "none",
			}}
			px="2"
			py="1"
			border="1px solid transparent"
			transition="0.2s"
			justifyContent={"center"}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<HStack justifyContent={"space-between"} align={"top"}>
				<EditablePreview width={"100%"} />
				<EditableInput
					boxShadow={"none"}
					outline="none"
					_focusVisible={{ boxShadow: "none" }}
				/>
			</HStack>
		</Editable>
	);
}

export default EditableDescription;
