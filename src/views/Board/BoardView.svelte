<script lang="ts">
	import { IconButton, Select } from "obsidian-svelte";

	import {
		DataFieldType,
		type DataFrame,
		type DataRecord,
	} from "../../lib/data";

	import Board from "./Board.svelte";

	import { i18n } from "../../lib/stores/i18n";
	import { app } from "../../lib/stores/obsidian";

	import { fieldToSelectableValue } from "../../views/helpers";
	import type { ProjectDefinition } from "../../types";
	import { CreateNoteModal } from "../../modals/create-note-modal";
	import { EditNoteModal } from "../../modals/edit-note-modal";
	import { groupRecordsByField } from "./board";
	import { createDataRecord } from "../../lib/api";
	import { HorizontalGroup } from "src/components/HorizontalGroup";
	import { Field } from "src/components/Field";
	import { ToolBar } from "src/components/ToolBar";
	import type { ViewApi } from "src/lib/view-api";
	import type { BoardConfig } from "./types";
	import { BoardSettingsModal } from "./settings/settings-modal";

	export let project: ProjectDefinition;
	export let frame: DataFrame;
	export let readonly: boolean;
	export let api: ViewApi;

	export let config: BoardConfig | undefined;
	export let onConfigChange: (cfg: BoardConfig) => void;

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
		new EditNoteModal(
			$app,
			fields,
			(record) => api.updateRecord(record, fields),
			record
		).open();
	}

	function handleRecordAdd(column: string) {
		new CreateNoteModal($app, project, (name, templatePath) => {
			if (groupByField) {
				api.addRecord(
					createDataRecord(
						name,
						project,
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
		<IconButton
			icon="settings"
			on:click={() => {
				new BoardSettingsModal($app, config ?? {}, (value) => {
					config = value;
					onConfigChange(value);
				}).open();
			}}
		/>
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
		columnWidth={config?.listWidth ?? 270}
	/>
</div>

<style>
	div {
		background-color: var(--background-primary);
		overflow: auto;
		padding: 8px;
	}
</style>
