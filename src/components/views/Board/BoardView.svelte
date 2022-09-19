<script lang="ts">
	import { normalizePath } from "obsidian";

	import {
		DataFieldType,
		type DataField,
		type DataRecord,
	} from "../../../lib/types";

	import { Field } from "../../core/Field";
	import { HorizontalGroup } from "../../core/HorizontalGroup";
	import { Select } from "../../core/Select";
	import { ToolBar } from "../../core/ToolBar";
	import Board from "./Board.svelte";

	import { api } from "../../../lib/stores/api";
	import { i18n } from "../../../lib/stores/i18n";
	import { app } from "../../../lib/stores/obsidian";

	import { fieldToSelectableValue } from "src/components/views/helpers";
	import type { WorkspaceDefinition } from "src/main";
	import { CreateRecordModal } from "src/modals/create-record-modal";
	import { ConfigureRecord } from "../../../modals/record-modal";
	import { groupRecordsByField } from "./board";

	interface BoardConfig {
		groupByField?: string;
		priorityField?: string;
	}

	export let records: DataRecord[];
	export let fields: DataField[];

	export let config: BoardConfig;
	export let onConfigChange: (config: BoardConfig) => void;
	export let workspace: WorkspaceDefinition;

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
		new CreateRecordModal($app, workspace, (name, templatePath) => {
			if (groupByField) {
				$api.createRecord(
					{
						name,
						path: normalizePath(
							workspace.path + "/" + name + ".md"
						),
						values: groupByField
							? {
									[groupByField.name]:
										column !==
										$i18n.t("views.board.no-status")
											? column
											: undefined,
							  }
							: {},
					},
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
				onChange={(value) =>
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
				onChange={(value) => {
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
