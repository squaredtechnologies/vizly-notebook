import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";

const MotionText = motion(Text);

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.02, // Adjust for letter staggering
		},
	},
};

const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: { duration: 0.5 }, // Adjust the animation duration as needed
	},
};

interface StaggeredTextProps {
	text: string;
	specialStyles?: { [key: string]: React.CSSProperties };
	onComplete?: () => void;
}

export const StaggeredText: React.FC<StaggeredTextProps> = ({
	text,
	specialStyles = {},
	onComplete,
}) => {
	// Splitting the text into words, then mapping to arrays of characters
	const words = text.split(" ").map((word) => word.split(""));

	const applySpecialStyle = (
		word: string,
	): React.CSSProperties | undefined => {
		return specialStyles[word] || undefined;
	};

	return (
		<MotionText
			fontFamily="Space Grotesk"
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			overflow="hidden"
			onAnimationComplete={onComplete}
		>
			{words.map((word, index) => (
				<Box
					as="span"
					key={index}
					display={"inline-block"}
					style={applySpecialStyle(word.join(""))}
				>
					{word.map((letter, letterIndex) => (
						<motion.span
							key={letterIndex}
							variants={itemVariants}
							style={{ display: "inline-block" }} // Necessary for correct spacing and animation
						>
							{letter}
						</motion.span>
					))}
					{/* Adding space after each word except the last one */}
					{index < words.length - 1 && (
						<motion.span
							variants={itemVariants}
							style={{ display: "inline-block" }}
						>
							&nbsp;
						</motion.span>
					)}
				</Box>
			))}
		</MotionText>
	);
};
