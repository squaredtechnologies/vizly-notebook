import { Range } from "@codemirror/state";
import {
	Decoration,
	DecorationSet,
	EditorView,
	ViewPlugin,
	ViewUpdate,
	WidgetType,
} from "@codemirror/view";
import { isPlatformMac } from "../../../../utils/utils";

class LineText extends WidgetType {
	constructor(readonly checked: boolean) {
		super();
	}

	toDOM() {
		const wrap = document.createElement("span");
		wrap.setAttribute("aria-hidden", "true");
		wrap.className = "cm-newline-text";
		const modKey = isPlatformMac() ? "⌘" : "Ctrl";
		wrap.textContent = `Type ${modKey} + K to use AI.`;
		return wrap;
	}
}

function lineHintText(view: EditorView) {
	const widgets: Range<Decoration>[] = [];

	const pos = view.state.selection.main.head;
	const line = view.state.doc.lineAt(pos);
	const emptySelection = view.state.selection.main.empty;
	const isLineEmpty = line.text.trim().length == 0;
	if (emptySelection && isLineEmpty) {
		widgets.push(
			Decoration.widget({ widget: new LineText(true), side: 1 }).range(
				pos,
			),
		);
	}

	return Decoration.set(widgets);
}

export const newLineText = [
	ViewPlugin.fromClass(
		class {
			view: EditorView;
			decorations: DecorationSet;

			constructor(view: EditorView) {
				this.view = view;
				this.decorations = lineHintText(view);
			}

			update(update: ViewUpdate) {
				if (
					update.docChanged ||
					update.viewportChanged ||
					update.selectionSet
				) {
					this.decorations = lineHintText(update.view);
				}
			}
		},
		{
			decorations: (v) => {
				return v.view.hasFocus ? v.decorations : Decoration.none;
			},
		},
	),
	EditorView.baseTheme({
		".cm-newline-text": {
			color: "rgba(118, 164, 214, 1)",
		},
	}),
];
