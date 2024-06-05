import { EditorState, StateField } from "@codemirror/state";
import { EditorView, Tooltip, showTooltip } from "@codemirror/view";

const cursorTooltipField = StateField.define<readonly Tooltip[]>({
	create: getCursorTooltips,

	update(tooltips, tr) {
		if (!tr.docChanged && !tr.selection) return tooltips;
		return getCursorTooltips(tr.state);
	},

	provide: (f) => showTooltip.computeN([f], (state) => state.field(f)),
});

function getCursorTooltips(state: EditorState): readonly Tooltip[] {
	return state.selection.ranges
		.filter((range) => range.empty)
		.map((range) => {
			let line = state.doc.lineAt(range.head);
			let text = "Cannot edit in read-only mode";
			return {
				pos: range.head,
				above: true,
				strictSide: true,
				arrow: false,
				create: () => {
					let dom = document.createElement("div");
					dom.className = "cm-tooltip-cursor";
					dom.textContent = text;
					return { dom };
				},
			};
		});
}

const cursorTooltipBaseTheme = EditorView.baseTheme({
	".cm-tooltip.cm-tooltip-cursor": {
		backgroundColor: "#66b",
		color: "white",
		border: "none",
		padding: "2px 7px",
		fontSize: "smaller",
		borderRadius: "4px",
		"& .cm-tooltip-arrow:before": {
			borderTopColor: "#66b",
		},
		"& .cm-tooltip-arrow:after": {
			borderTopColor: "transparent",
		},
	},
	".cm-tooltip-cursor:hover": {
		color: "red" /* Changes text color to red on hover */,
		cursor: "pointer" /* Optional: Changes the cursor to a pointer to indicate it's clickable */,
	},
});

export function cursorTooltip() {
	return [cursorTooltipField, cursorTooltipBaseTheme];
}
