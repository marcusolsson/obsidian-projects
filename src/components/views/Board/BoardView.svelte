<script lang="ts">
	import {
		DataFieldType,
		type DataField,
		type DataRecord,
	} from "../../../lib/datasource";
	import { api } from "../../../lib/stores";

	import { Field } from "../../core/Field";
	import { HorizontalGroup } from "../../core/HorizontalGroup";
	import { Select } from "../../core/Select";
	import { ToolBar } from "../../core/ToolBar";

	import { ConfigureRecord } from "../../../modals/record-modal";

	import { get } from "svelte/store";
	import { app } from "../../../lib/stores";
	import { fieldToSelectableValue } from "src/lib/helpers";
	import { groupRecordsByField, unique } from "./board";
	import { Notice } from "obsidian";
	import Board from "./Board.svelte";

	interface BoardConfig {
		groupByField?: string;
		priorityField?: string;
	}

	export let records: DataRecord[];
	export let fields: DataField[];

	export let config: BoardConfig;
	export let onConfigChange: (config: BoardConfig) => void;

	$: textFields = fields.filter(
		(field) => field.type === DataFieldType.String
	);

	$: groupByField =
		fields.find((field) => config?.groupByField === field.name) ??
		textFields[0];

	$: numberFields = fields.filter(
		(field) => field.type === DataFieldType.Number
	);

	$: priorityField =
		fields.find((field) => config?.priorityField === field.name) ??
		numberFields[0];

	$: groupedRecords = groupByField
		? groupRecordsByField(records, groupByField.name)
		: {};

	$: columns = groupByField ? unique(records, groupByField.name) : [];

	function handleRecordClick(record: DataRecord): (event: Event) => void {
		return () => {
			new ConfigureRecord(
				$app,
				fields,
				(record) => {
					$api.updateRecord(record);
				},
				record
			).open();
		};
	}

	function handleRecordAdd(column: string): () => void {
		return () => {
			if (groupByField) {
				new ConfigureRecord(
					get(app),
					fields,
					(record) => {
						new Notice("Not implemented yet.");
					},
					{
						name: "Untitled",
						path: "Untitled.md",
						values: {
							[groupByField.name]: column,
						},
					}
				).open();
			}
		};
	}
</script>

<div>
	<ToolBar>
		<p />
		<HorizontalGroup>
			<Field name="Group by">
				<Select
					value={groupByField?.name ?? ""}
					options={textFields.map(fieldToSelectableValue)}
					onChange={(value) =>
						onConfigChange({
							...config,
							groupByField: value,
						})}
					placeholder="No text fields"
				/>
			</Field>
			<Field name="Priority">
				<Select
					value={priorityField?.name ?? ""}
					options={numberFields.map(fieldToSelectableValue)}
					onChange={(value) =>
						onConfigChange({
							...config,
							priorityField: value,
						})}
					placeholder="No number fields"
				/>
			</Field>
		</HorizontalGroup>
	</ToolBar>
	<Board
		columns={columns.sort().map((column) => ({
			id: column,
			name: column,
			records: groupedRecords[column] ?? [],
		}))}
		groupByPriority={priorityField?.name}
		groupByStatus={groupByField?.name}
		onRecordClick={(record) => handleRecordClick(record)}
		onRecordAdd={(column) => handleRecordAdd(column)}
	/>
</div>

<style>
	div {
		background-color: var(--background-primary);
		height: 100%;
	}
</style>
