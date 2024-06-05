import { Contents } from "@jupyterlab/services";
import { captureException } from "@sentry/nextjs";
import * as jschardet from "jschardet";
import * as XLSX from "xlsx";
import {
	EXCEL_MIME_TYPE,
	SPREADHSEET_MIME_TYPE,
} from "../../components/cell/output/mimeTypes";
import ConnectionManager from "../../services/connection/connectionManager";
import { NoterousFile } from "../../types/file.types";
import {
	CHUNK_SIZE,
	MAX_SPREADSHEET_SIZE_TO_PREVIEW,
} from "../constants/constants";

export async function saveFilePreview(
	file: File,
	filePath?: string,
	lines: number = 3,
) {
	const privateFileName = "." + file.name;
	const path = filePath ? filePath + privateFileName : privateFileName;

	const reader = new FileReader();
	const chunk = file.slice(0, CHUNK_SIZE);

	const contentPromise = new Promise<string>((resolve, reject) => {
		reader.onload = function (event) {
			if (!event.target || !event.target.result) return;
			let text;
			if (
				(file.type === SPREADHSEET_MIME_TYPE ||
					file.type === EXCEL_MIME_TYPE) &&
				file.size < MAX_SPREADSHEET_SIZE_TO_PREVIEW
			) {
				// TODO: add time tracking to remove this if it becomes too slow
				const data = new Uint8Array(event.target.result as ArrayBuffer);
				const workbook = XLSX.read(data, { type: "array" });
				const worksheet = workbook.Sheets[workbook.SheetNames[0]];
				text = XLSX.utils.sheet_to_csv(worksheet);
			} else {
				const dataUrl = event.target.result.toString();
				const base64 = dataUrl.split(",")[1];
				text = atob(base64 || "");
			}

			let encoding = "utf-8";
			try {
				const detected = jschardet.detect(text);
				if (detected) {
					encoding = detected.encoding;
				}
			} catch (e) {
				console.error("Could not fetch encoding: " + e);
			}

			try {
				const linesArray = text?.split("\n");
				let maxCommaCount = 0;
				let lineWithMaxCommas = Number.MAX_SAFE_INTEGER;
				linesArray.forEach((line, i) => {
					const commaCount = (line.match(/,/g) || []).length;
					if (commaCount > maxCommaCount) {
						maxCommaCount = commaCount;
						lineWithMaxCommas = Math.min(i, lineWithMaxCommas);
					}
				});

				lineWithMaxCommas =
					lineWithMaxCommas == Number.MAX_SAFE_INTEGER
						? 0
						: lineWithMaxCommas;

				const content =
					linesArray
						.slice(lineWithMaxCommas, lineWithMaxCommas + lines)
						.join("\n") || "";
				resolve(
					btoa(
						decodeURIComponent(
							encodeURIComponent(
								JSON.stringify({
									content,
									dataStartLine: lineWithMaxCommas,
									fileEncoding: encoding,
								}),
							),
						),
					),
				);
			} catch (e) {
				console.error(e);
				resolve("");
			}
		};
		reader.onerror = (event) =>
			reject(`Failed to read "${file.name}":` + event);
	});

	if (file.type === SPREADHSEET_MIME_TYPE || file.type === EXCEL_MIME_TYPE) {
		reader.readAsArrayBuffer(file);
	} else {
		reader.readAsDataURL(chunk);
	}

	const content = await contentPromise;

	const name = "." + file.name;
	const type: Contents.ContentType = "file";
	const format: Contents.FileFormat = "base64";
	const model: Partial<Contents.IModel> = {
		type,
		format,
		name,
		content,
	};

	return (
		(await ConnectionManager.getInstance().serviceManager?.contents.save(
			path,
			model,
		)) ?? Promise.resolve({} as Contents.IModel)
	);
}

export const getPreview = (file: Contents.IModel): Promise<string> => {
	// Previews are parsed and saved in base64 strings, when they are fetched from the ContentsManager they are decoded
	return new Promise((resolve, reject) => {
		let content = file.content as string;
		if (content.length > 400) {
			content = content.substring(0, 397) + "[...]";
		}
		resolve(content);
	});
};

export const getFileEncodings = async (files: NoterousFile[]): Promise<any> => {
	return files.reduce(async (prevPromise, file) => {
		const prev = await prevPromise;
		let fileEncoding = "utf-8";

		try {
			const fileToAnalyze =
				await ConnectionManager.getInstance().serviceManager?.contents.get(
					"." + file.name,
				);
			if (!fileToAnalyze) {
				throw new Error("File not found");
			}
			// Attempt to parse the content as JSON
			const parsedFile = JSON.parse(fileToAnalyze.content as string);
			// Retrieve `fileEncoding` if it exists, default to 0 if not
			fileEncoding = parsedFile.fileEncoding || 0;
		} catch (error) {
			captureException(error);
			console.warn(
				"Error while fetching fileEncoding for " +
					file.name +
					": " +
					error,
			);
			// If there's an error or `fileEncoding` is not available, linesToSkip remains 0
		}

		return {
			...prev,
			[file.name]: fileEncoding,
		};
	}, Promise.resolve({}));
};

export const getLinesToSkip = async (files: NoterousFile[]): Promise<any> => {
	return files.reduce(async (prevPromise, file) => {
		const prev = await prevPromise;
		let linesToSkip = 0;

		try {
			const fileToAnalyze =
				await ConnectionManager.getInstance().serviceManager?.contents.get(
					"." + file.name,
				);
			if (!fileToAnalyze) {
				throw new Error("File not found");
			}
			// Attempt to parse the content as JSON
			const parsedFile = JSON.parse(fileToAnalyze.content as string);
			// Retrieve `dataStartLine` if it exists, default to 0 if not
			linesToSkip = parsedFile.dataStartLine || 0;
		} catch (error) {
			captureException(error);
			console.warn(
				"Error while fetching linesToSkip for " +
					file.name +
					": " +
					error,
			);
			// If there's an error or `dataStartLine` is not available, linesToSkip remains 0
		}

		return {
			...prev,
			[file.name]: linesToSkip,
		};
	}, Promise.resolve({}));
};

export const getFilePreviews = async (files: NoterousFile[]): Promise<any> => {
	return files.reduce(async (prevPromise, file) => {
		const prev = await prevPromise;
		let filePreview = "";

		try {
			const fileToPreview =
				await ConnectionManager.getInstance().serviceManager?.contents.get(
					"." + file.name,
				);
			if (!fileToPreview) {
				throw new Error("File not found");
			}
			filePreview = await getPreview(fileToPreview);
		} catch (error) {
			captureException(error);
			console.warn(
				"Error while getting file preview for " +
					file.name +
					": " +
					error,
			);
		}

		return {
			...prev,
			[file.name]: filePreview,
		};
	}, Promise.resolve({}));
};

export const getFileNames = (files: NoterousFile[]): string[] => {
	return files.map((file) => file.name);
};

export const getFileMetadata = async (files: NoterousFile[]): Promise<any> => {
	return files.reduce(async (prevPromise, file) => {
		const prev = await prevPromise;
		let filePreview = "";
		let linesToSkip = 0;
		let fileEncoding = "utf-8";

		try {
			const fileMetadata =
				await ConnectionManager.getInstance().serviceManager?.contents.get(
					"." + file.name,
				);
			if (!fileMetadata) {
				throw new Error("File not found");
			}

			filePreview = await getPreview(fileMetadata);

			const parsedFile = JSON.parse(fileMetadata.content as string);
			linesToSkip = parsedFile.dataStartLine || 0;
			fileEncoding = parsedFile.fileEncoding || "utf-8";
		} catch (error) {
			captureException(error);
			console.warn(
				"Error while getting file metadata for " +
					file.name +
					": " +
					error,
			);
		}

		return {
			...prev,
			[file.name]: {
				preview: filePreview,
				linesToSkip,
				encoding: fileEncoding,
			},
		};
	}, Promise.resolve({}));
};
