import { ICell } from "@jupyterlab/nbformat";

export type CodeLine = {
	c: string;
	l: number;
};

export type NoterousCell = ICell & {
	metadata: {
		noterous?: Record<string, any>;
	};
};
