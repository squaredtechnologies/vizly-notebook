import { Avatar, Flex, useBreakpointValue } from "@chakra-ui/react";
import { CELL_GUTTER_WIDTH } from "../../utils/constants/constants";

export const CellPadding = ({
	extraAdjustment = false,
}: {
	extraAdjustment?: boolean;
}) => {
	return (
		<Flex
			width={`${CELL_GUTTER_WIDTH + (extraAdjustment ? 5 : 0)}px`}
			alignItems={"flex-start"}
			justifyContent={"flex-end"}
		>
			<Flex />
		</Flex>
	);
};

CellPadding.displayName = "CellPadding";

export default CellPadding;
