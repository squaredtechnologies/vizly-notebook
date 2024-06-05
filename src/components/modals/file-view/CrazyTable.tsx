import { HotkeysProvider } from "@blueprintjs/core";
import {
	Cell,
	Column,
	ColumnHeaderCell,
	ColumnHeaderRenderer,
	RenderMode,
	RowHeaderCell,
	RowHeaderRenderer,
	Table2,
} from "@blueprintjs/table";
import "@blueprintjs/table/lib/css/table.css";
import { Box, Text } from "@chakra-ui/react";
import { useRef } from "react";

interface CrazyTableProps {
	data: Record<string, any>[];
	columns: string[];
}

const CrazyTable: React.FC<CrazyTableProps> = ({ data, columns }) => {
	const tableRef = useRef<Table2>(null);

	const cellRenderer = (rowIndex: number, columnIndex: number) => {
		const columnName = columns[columnIndex];
		return (
			<Box
				as={Cell}
				p={"0px 10px"}
				display={"flex"}
				alignItems={"center"}
				height="36px"
				background="var(--chakra-colors-chakra-body-bg)"
				color={"var(--chakra-colors-chakra-body-text)"}
				boxShadow={"0px 0px 0.5px 0.5px var(--jp-layout-color3)"}
			>
				{data[rowIndex][columnName]}
			</Box>
		);
	};

	const headerRenderer: ColumnHeaderRenderer = (columnIndex) => {
		const columnName = columns[columnIndex];
		return (
			<Box
				p={"0px 10px"}
				as={ColumnHeaderCell}
				fontFamily={"Space Grotesk"}
				fontWeight={"semibold"}
				background="var(--jp-layout-color2)"
				color={"var(--chakra-colors-chakra-body-text)"}
				boxShadow={"0px 0px 2px 2px green"}
				borderRight={"1px solid var(--jp-layout-color3)"}
			>
				<Text isTruncated>{columnName}</Text>
			</Box>
		);
	};

	const rowHeaderCellRenderer: RowHeaderRenderer = (columnIndex) => {
		return (
			<Box
				as={RowHeaderCell}
				display={"flex"}
				alignItems={"center"}
				fontSize="small"
				textAlign={"right"}
				background="var(--jp-layout-color2)"
				color={"var(--chakra-colors-chakra-body-text)"}
				pr={"4px"}
			>
				{columnIndex}
			</Box>
		);
	};

	const blueprintColumns = columns.map((columnName, index) => (
		<Column
			key={index}
			name={columnName}
			cellRenderer={(rowIndex: number) => cellRenderer(rowIndex, index)}
			columnHeaderCellRenderer={() => headerRenderer(index)}
		/>
	));

	return (
		<HotkeysProvider>
			<Table2
				ref={tableRef}
				numRows={data.length}
				renderMode={RenderMode.BATCH}
				enableFocusedCell={true}
				defaultRowHeight={28}
				rowHeaderCellRenderer={(index) => rowHeaderCellRenderer(index)}
			>
				{blueprintColumns}
			</Table2>
		</HotkeysProvider>
	);
};

export default CrazyTable;
