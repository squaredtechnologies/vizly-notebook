import { python } from "@codemirror/lang-python";
import CodeMirror from "@uiw/react-codemirror";

import { jupyterTheme } from "../components/cell/input/theme";

export const BasicCodeMirrorEditor = ({
	code,
	shouldOverflow = false,
}: {
	code: string;
	shouldOverflow?: boolean;
}) => {
	return (
		<CodeMirror
			className="cell-editor"
			style={{
				fontFamily: "monospace",
				overflow: "auto",
				width: "100%",
				maxHeight: shouldOverflow ? "200px" : "unset",
				borderRadius: "4px",
			}}
			lang="python"
			value={code}
			extensions={[jupyterTheme, python()]}
			readOnly={true}
			editable={false}
			basicSetup={{
				lineNumbers: false,
				tabSize: 4,
				foldGutter: false,
				highlightActiveLineGutter: true,
				highlightActiveLine: false,
			}}
		/>
	);
};
