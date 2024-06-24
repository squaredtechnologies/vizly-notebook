import { StreamingTextResponse, CoreTool, streamText } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';
import { v4 as uuidv4 } from "uuid";
import { MessageType } from "../utils/types/messages";
import { LangfuseClient, captureAIStream } from "../utils/langfuse";
import { ModelInformation, getModelForRequest, getAPIKeyForRequest, getBaseURLForRequest } from "../utils/model";
import { isBrowser } from "../utils/openai";
import { getThemePrompt } from "../utils/promptUtils";

// Constants for Cell Edit Function
export const CELL_EDIT_FUNCTION_NAME = "editCode";
export const CELL_EDIT_FUNCTION: CoreTool = {
	description: "The function to call after generating the edits required by the user.",
	parameters: z.object({
	  source: z.string().describe("JSON formatted string of the cell source. Should be Python code, should never be undefined."),
	}),
  };

// Function to handle cell editing
export async function handleCellEdit(data: {
	userRequest?: string;
	currentCellSource?: string;
	currentNamespace?: string;
	theme: "dark" | "light";
	uniqueId?: string;
	modelInformation?: ModelInformation;
}) {
	const {
		userRequest,
		currentCellSource,
		currentNamespace,
		theme,
		uniqueId,
		modelInformation,
	} = data;

	const context = {
		userRequest: userRequest,
		currentCellSource: currentCellSource,
		currentNamespace: currentNamespace,
	};

	const themePrompt = getThemePrompt(theme);

	// Base system prompt
	let systemPrompt = `You are an expert Python assistant that can edit Python code in order to make sure it's output or intended function more closely matches the request of the user.
General working principles:
- Generate syntactically correct Python code
- Wherever possible, use the existing Python code as much as possible, only making small edits where necessary
- Do not make assumptions about variables or functions unless the assumption is supported by the variables in the namespace
- When displaying dataframes, use the 'display' function instead of print
You will be given:
- A user request
- Current Python code that the user wants to edit
- List of files the user has uploaded
- Current Python namespace
${themePrompt}`;

	if (isBrowser()) {
		systemPrompt += `
- Only return the Python code and no other preamble
- Do not surround code with back ticks`;
	}

	const messages: MessageType[] = [
		{
			role: "user",
			content: JSON.stringify(context),
		},
	];

	const modelType = modelInformation?.modelType;
	const model = getModelForRequest(modelInformation);
	const apiKey = getAPIKeyForRequest(modelInformation);
	const baseURL = getBaseURLForRequest(modelInformation);
	
	let client: any;
	if (modelType === "openai" || modelType === "ollama") {
		const openai = createOpenAI({ apiKey: apiKey, baseURL: baseURL});
		client = openai(model);
	} else {
		throw new Error("Model type not supported");
	}

	const trace = LangfuseClient.getInstance().trace({
		id: uuidv4(),
		name: `editCell`,
		input: messages,
		userId: uniqueId,
	});

	const generation = trace.generation({
		name: `editCell`,
		input: messages,
		model: model,
	});

	const response = await streamText({
		model: client,
		messages: messages,
		temperature: 0.3,
		system: systemPrompt,
		...(isBrowser()
			? {
				tools: {[CELL_EDIT_FUNCTION_NAME] : CELL_EDIT_FUNCTION},
				toolChoice: "required",
			  } : {}),
	});
	
	const stream = captureAIStream(response, trace, generation);
	return new StreamingTextResponse(stream);
}
