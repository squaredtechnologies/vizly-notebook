import {
	Button,
	HStack,
	Heading,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	VStack,
} from "@chakra-ui/react";
import { Contents } from "@jupyterlab/services";
import React, { useEffect, useState } from "react";
import ConnectionManager from "../../../services/connection/connectionManager";
import { standaloneToast } from "../../../theme";
import type { PreviewData } from "../../file/renderers";
import { FilePreview } from "../../file/renderers";
import { getFilePreview } from "../../file/utils";
import { useFileViewModalState } from "./FileViewModalStore";

async function retrieveFile(path: string): Promise<File | null> {
	const file =
		(await ConnectionManager.getInstance().serviceManager?.contents.get(
			path,
		)) as Contents.IModel;

	if (file.type === "file") {
		const content = file.content;

		if (file.format === "base64" && typeof content === "string") {
			// Handle binary data encoded in base64 (like Excel files)
			const binaryContent = atob(content);
			const arrayBuffer = new Uint8Array(binaryContent.length);
			for (let i = 0; i < binaryContent.length; i++) {
				arrayBuffer[i] = binaryContent.charCodeAt(i);
			}
			const blob = new Blob([arrayBuffer], { type: file.mimetype });
			const fileObject = new File([blob], file.name, {
				type: file.mimetype,
			});
			return fileObject;
		} else if (typeof content === "string") {
			// Handle plain text data (like CSVs)
			const blob = new Blob([content], { type: file.mimetype });
			const fileObject = new File([blob], file.name, {
				type: file.mimetype,
			});
			return fileObject;
		} else {
			console.error("Unsupported content format or not a string");
			return null;
		}
	} else {
		console.error("Fetched content is not a file");
		return null;
	}
}

const FileViewModal: React.FC = () => {
	// state for the file to show
	const file = useFileViewModalState((state) => state.file);
	const { showFileViewModal, setShowFileViewModal } = useFileViewModalState();
	const [previewData, setPreviewData] = useState<PreviewData | undefined>();

	useEffect(() => {
		setPreviewData(undefined);

		if (!file) return;

		async function getFileAndPreview() {
			try {
				const fileToPreview = await retrieveFile(file!.name);
				if (fileToPreview === null)
					throw new Error("File could not be retrieved.");

				const previewData = await getFilePreview(fileToPreview as any);
				setPreviewData(previewData);
			} catch (err) {
				standaloneToast({
					title: "Error",
					description:
						"An error occurred while trying to view this file.",
					status: "error",
					duration: 10000,
					isClosable: true,
				});
				console.error(err);
			}
		}

		getFileAndPreview();
	}, [file]);

	return (
		<Modal
			size={["sm", "md", "xl", "3xl"]}
			isOpen={showFileViewModal}
			onClose={() => setShowFileViewModal(false)}
		>
			<ModalOverlay />
			<ModalContent p={4}>
				<ModalBody>
					<VStack mb={4} alignItems={"flex-start"}>
						<Heading
							fontFamily={"Space Grotesk"}
							isTruncated
							fontSize={"2xl"}
							title={file?.name}
						>
							{file?.name}
						</Heading>
					</VStack>
					<FilePreview previewData={previewData!} />
					<HStack width="100%" justifyContent={"flex-end"} mt={4}>
						<Button
							colorScheme="red"
							variant="ghost"
							fontFamily={"Space Grotesk"}
							onClick={() => setShowFileViewModal(false)}
						>
							Close
						</Button>
					</HStack>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default FileViewModal;
