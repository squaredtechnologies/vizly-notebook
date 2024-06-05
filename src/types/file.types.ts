import { NoterousCell } from "./code.types";

export interface NoterousFile extends File {
	type: string;
	name: string;
	last_modified: string;
	path: string;
	size: number;
	slice: (start: number, end: number) => Blob;
	mimetype: string;
	content: any;
}

export type NotebookMetadata = {
	noterous: {
		id: string;
		preferredLanguage?: string;
		kernelId?: string;
	};
} & Record<string, any>;

export type NotebookFile = {
	cells: NoterousCell[];
	metadata: NotebookMetadata;
	nbformat: number;
	nbformat_minor: number;
};
