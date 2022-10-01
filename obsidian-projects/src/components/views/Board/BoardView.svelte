<script lang="ts">
	import { Select } from "obsidian-svelte";

	import {
		DataFieldType,
		type DataFrame,
		type DataRecord,
	} from "../../../lib/types";

	import { Field } from "../../core/Field";
	import { HorizontalGroup } from "../../core/HorizontalGroup";
	import { ToolBar } from "../../core/ToolBar";
	import Board from "./Board.svelte";

	import { i18n } from "../../../lib/stores/i18n";
	import { app } from "../../../lib/stores/obsidian";

	import { fieldToSelectableValue } from "../../views/helpers";
	import type { WorkspaceDefinition } from "../../../types";
	import { CreateRecordModal } from "../../../modals/create-record-modal";
	import { ConfigureRecord } from "../../../modals/record-modal";
	import { groupRecordsByField } from "./board";
	import { createDataRecord } from "../../../lib/api";

	interface BoardConfig {
		groupByField?: string;
		priorityField?: string;
	}

	export let frame: DataFrame;

	export let config: BoardConfig;
	export let onConfigChange: (config: BoardConfig) => void;
	export let workspace: WorkspaceDefinition;
	export let readonly: boolean;
	export let onRecordAdd: (record: DataRecord, templatePath: string) => void;
	export let onRecordUpdate: (record: DataRecord) => void;
	// export let onRecordDelete: (id: string) => void;

	$: ({ fields, records } = frame);

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

	function handleRecordClick(record: DataRecord) {
		new ConfigureRecord($app, fields, onRecordUpdate, record).open();
	}

	function handleRecordAdd(column: string) {
		new CreateRecordModal($app, workspace, (name, templatePath) => {
			if (groupByField) {
				onRecordAdd(
					createDataRecord(
						name,
						workspace,
						groupByField
							? {
									[groupByField.name]:
										column !==
										$i18n.t("views.board.no-status")
											? column
											: undefined,
							  }
							: {}
					),
					templatePath
				);
			}
		}).open();
	}
</script>

<ToolBar>
	<p />
	<HorizontalGroup>
		<Field name={$i18n.t("views.board.fields.status")}>
			<Select
				value={groupByField?.name ?? ""}
				options={textFields.map(fieldToSelectableValue)}
				on:change={({ detail: value }) =>
					onConfigChange({
						...config,
						groupByField: value,
					})}
				placeholder={$i18n.t("views.board.fields.none") ?? ""}
				allowEmpty
			/>
		</Field>
		<Field name={$i18n.t("views.board.fields.priority")}>
			<Select
				value={priorityField?.name ?? ""}
				options={numberFields.map(fieldToSelectableValue)}
				on:change={({ detail: value }) => {
					onConfigChange({
						...config,
						priorityField: value,
					});
				}}
				placeholder={$i18n.t("views.board.fields.none") ?? ""}
				allowEmpty
			/>
		</Field>
	</HorizontalGroup>
</ToolBar>
<div>
	<Board
		{readonly}
		columns={columns
			.sort((a, b) => {
				if (a === $i18n.t("views.board.no-status")) return -1;
				if (b === $i18n.t("views.board.no-status")) return 1;
				if (a === $i18n.t("views.board.no-status") && a === b) return 0;

				return a.localeCompare(b);
			})
			.map((column) => ({
				id: column,
				name: column,
				records: groupedRecords[column] ?? [],
			}))}
		groupByPriority={priorityField?.name}
		onRecordClick={handleRecordClick}
		onRecordAdd={handleRecordAdd}
	/>
</div>

<style>
	div {
		background-color: var(--background-primary);
		overflow: auto;
	}
</style>
