<script lang="ts">
	import {
		DataFieldType,
		type DataField,
		type DataRecord,
	} from "../../../lib/data";

	import { Field } from "../../core/Field";
	import { HorizontalGroup } from "../../core/HorizontalGroup";
	import { Select } from "../../core/Select";
	import { ToolBar } from "../../core/ToolBar";

	import { ConfigureRecord } from "../../../modals/record-modal";

	import { app } from "../../../lib/stores/obsidian";
	import { api } from "../../../lib/stores/api";
	import { fieldToSelectableValue } from "src/components/views/helpers";
	import { groupRecordsByField } from "./board";
	import Board from "./Board.svelte";
	import { InputDialogModal } from "src/modals/input-dialog";
	import { normalizePath } from "obsidian";

	interface BoardConfig {
		groupByField?: string;
		priorityField?: string;
	}

	export let records: DataRecord[];
	export let fields: DataField[];

	export let config: BoardConfig;
	export let onConfigChange: (config: BoardConfig) => void;
	export let rootPath: string = "";

	$: textFields = fields.filter(
		(field) => field.type === DataFieldType.String
	);

	$: groupByField = fields.find(
		(field) => config?.groupByField === field.name
	);

	$: numberFields = fields.filter(
		(field) => field.type === DataFieldType.Number
	);

	$: priorityField = fields.find(
		(field) => config?.priorityField === field.name
	);

	$: groupedRecords = groupRecordsByField(records, groupByField?.name);

	$: columns = Object.entries(groupedRecords).map((entry) => entry[0]);

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

	function handleRecordAdd(column: string) {
		if (groupByField) {
			new InputDialogModal(
				$app,
				"Add record",
				"Add",
				(value) => {
					if (groupByField) {
						$api.createRecord({
							name: value,
							path: normalizePath(rootPath + "/" + value + ".md"),
							values: {
								[groupByField.name]:
									column !== "No status" ? column : undefined,
							},
						});
					}
				},
				"Untitled"
			).open();
		}
	}
</script>

<ToolBar>
	<p />
	<HorizontalGroup>
		<Field name="Status field">
			<Select
				value={groupByField?.name ?? ""}
				options={textFields.map(fieldToSelectableValue)}
				onChange={(value) =>
					onConfigChange({
						...config,
						groupByField: value,
					})}
				placeholder="None"
				allowEmpty
			/>
		</Field>
		<Field name="Priority field">
			<Select
				value={priorityField?.name ?? ""}
				options={numberFields.map(fieldToSelectableValue)}
				onChange={(value) => {
					onConfigChange({
						...config,
						priorityField: value,
					});
				}}
				placeholder="None"
				allowEmpty
			/>
		</Field>
	</HorizontalGroup>
</ToolBar>
<div>
	<Board
		columns={columns
			.sort((a, b) => {
				if (a === "No status") return -1;
				if (b === "No status") return 1;
				if (a === "No status" && a === b) return 0;

				return a.localeCompare(b);
			})
			.map((column) => ({
				id: column,
				name: column,
				records: groupedRecords[column] ?? [],
			}))}
		groupByPriority={priorityField?.name}
		onRecordClick={(record) => handleRecordClick(record)}
		onRecordAdd={(column) => handleRecordAdd(column)}
	/>
</div>

<style>
	div {
		background-color: var(--background-primary);
		overflow: auto;
	}
</style>
