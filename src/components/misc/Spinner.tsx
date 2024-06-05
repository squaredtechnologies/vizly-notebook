import {
	Spinner as ChakraSpinner,
	SpinnerProps as ChakraSpinnerProps,
} from "@chakra-ui/react";
import React from "react";

interface SpinnerInputProps extends Omit<ChakraSpinnerProps, "size"> {
	isSpinning: boolean;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const Spinner: React.FC<SpinnerInputProps> = ({
	isSpinning,
	size = "md",
	...props
}) => {
	return (
		<>
			{isSpinning && (
				<ChakraSpinner
					thickness="3px"
					speed="0.65s"
					size={size}
					emptyColor="gray.200"
					color="black"
					{...props}
				/>
			)}
		</>
	);
};

export default Spinner;
