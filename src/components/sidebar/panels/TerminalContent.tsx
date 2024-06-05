import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
	Box,
	Divider,
	HStack,
	Heading,
	IconButton,
	VStack,
	useColorMode,
} from "@chakra-ui/react";
import { ReactTerminal, TerminalContextProvider } from "react-terminal";
import { DoubleChevronLeftIcon } from "../../../assets/icons";

const MyTerminal = () => {
	const commands = {};

	return (
		<Box width="100%" height="100%">
			<TerminalContextProvider>
				<ReactTerminal
					themes={{
						"my-custom-theme": {
							themeBGColor: "var(--chakra-colors-chakra-body-bg)",
							themeToolbarColor: "#DBDBDB",
							themeColor: "var(--chakra-colors-chakra-body-text)",
							themePromptColor: "var(--chakra-colors-green-500)",
						},
					}}
					defaultHandler={(input: string) => {
						return "ayoooo";
					}}
					showControlBar={false}
					showControlButtons={false}
					theme="my-custom-theme"
					commands={commands}
				/>
			</TerminalContextProvider>
		</Box>
	);
};

export const ThemeToggle = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	return (
		<IconButton
			icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
			onClick={toggleColorMode}
			variant="ghost"
			aria-label="Toggle theme"
		/>
	);
};

export const TerminalContent = ({
	handleCloseSidebar,
}: {
	handleCloseSidebar: () => void;
}) => {
	return (
		<Box
			width="340px"
			height="100%"
			borderRight="1px solid var(--chakra-colors-chakra-border-color)"
		>
			<VStack width="100%" height="100%" gap={0}>
				<HStack
					width="100%"
					display={"flex"}
					flex="0 0 auto"
					justifyContent={"space-between"}
					padding={"12px"}
				>
					<Heading fontSize="smaller" textTransform={"uppercase"}>
						Terminal
					</Heading>
					<IconButton
						variant={"ghost"}
						icon={<DoubleChevronLeftIcon />}
						aria-label="Back"
						size="xs"
						onClick={handleCloseSidebar}
					/>
				</HStack>
				<Divider />
				<MyTerminal />
				<Divider />
			</VStack>
		</Box>
	);
};

export default TerminalContent;
