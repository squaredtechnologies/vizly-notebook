import { HStack, Text } from "@chakra-ui/react";

export default function CharacterCounter({
	length,
	maxLength,
}: {
	length: number;
	maxLength: number;
}) {
	return (
		<HStack title={`Character count: ${length} of ${maxLength} used`}>
			<Text
				fontSize="x-small"
				fontWeight={length > maxLength ? "700" : "500"}
				color={length > maxLength ? "red" : "inherit"}
			>
				{length} / {maxLength}
			</Text>
		</HStack>
	);
}
