import { NotebookFile } from "../types/file.types";

export function validateNotebookModel(
	model: NotebookFile,
): asserts model is NotebookFile {
	validateProperty(model, "cells", "array");
	validateProperty(model, "metadata", "object");
	validateProperty(model, "nbformat", "number");
	validateProperty(model, "nbformat_minor", "number");
}

export function validateProperty(
	object: any,
	name: string,
	typeName?: string,
	values: any[] = [],
): void {
	if (!object.hasOwnProperty(name)) {
		throw Error(`Missing property '${name}'`);
	}
	const value = object[name];

	if (typeName !== void 0) {
		let valid = true;
		switch (typeName) {
			case "array":
				valid = Array.isArray(value);
				break;
			case "object":
				valid = typeof value !== "undefined";
				break;
			default:
				valid = typeof value === typeName;
		}
		if (!valid) {
			throw new Error(`Property '${name}' is not of type '${typeName}'`);
		}

		if (values.length > 0) {
			let valid = true;
			switch (typeName) {
				case "string":
				case "number":
				case "boolean":
					valid = values.includes(value);
					break;
				default:
					valid = values.findIndex((v) => v === value) >= 0;
					break;
			}
			if (!valid) {
				throw new Error(
					`Property '${name}' is not one of the valid values ${JSON.stringify(
						values,
					)}`,
				);
			}
		}
	}
}
