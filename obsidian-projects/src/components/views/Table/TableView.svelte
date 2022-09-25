<script lang="ts">
	import type {
		GridColDef,
		GridRowProps,
	} from "../../core/DataGrid/data-grid";

	import DataGrid from "../../core/DataGrid/DataGrid.svelte";
	import HorizontalGroup from "../../core/HorizontalGroup/HorizontalGroup.svelte";
	import SwitchSelect from "../../core/SwitchSelect/SwitchSelect.svelte";
	import ToolBar from "../../core/ToolBar/ToolBar.svelte";

	import { i18n } from "../../../lib/stores/i18n";
	import { app } from "../../../lib/stores/obsidian";

	import { CreateRecordModal } from "../../../modals/create-record-modal";
	import { InputDialogModal } from "../../../modals/input-dialog";
	import { ConfigureRecord } from "../../../modals/record-modal";
	import { createDataRecord } from "../../../lib/api";

	import type { DataFrame, DataRecord } from "../../../lib/types";
	import type { WorkspaceDefinition } from "../../../types";
	import type { GridConfig } from "./types";

	export let frame: DataFrame;
	export let config: GridConfig;
	export let onConfigChange: (config: GridConfig) => void;
	export let workspace: WorkspaceDefinition;
	export let readonly: boolean;

	export let onRecordAdd: (record: DataRecord, templatePath: string) => void;
	export let onRecordUpdate: (record: DataRecord) => void;
	export let onRecordDelete: (id: string) => void;
	export let onFieldRename: (from: string, to: string) => void;
	export let onFieldDelete: (field: string) => void;

	$: ({ fields, records } = frame);

	$: fieldConfig = config?.fieldConfig ?? {};

	$: columns = fields.map<GridColDef>((field) => {
		const colDef: GridColDef = {
			field: field.name,
			type: field.type,
			width: fieldConfig[field.name]?.width ?? 180,
			hide: fieldConfig[field.name]?.hide ?? false,
			editable: !field.derived,
		};

		const weight = defaultWeight(field.name);

		if (weight) {
			colDef.weight = weight;
		}

		return colDef;
	});

	$: rows = records.map<GridRowProps>((record) => ({
		rowId: record.id,
		row: record.values,
	}));

	function defaultWeight(field: string): number | undefined {
		switch (field) {
			case "name":
				return 1;
			case "path":
				return 2;
			case "Field":
				return 1;
			default:
				return undefined;
		}
	}

	function handleVisibilityChange(field: string, enabled: boolean) {
		const newconfig = {
			...config,
			fieldConfig: {
				...fieldConfig,
				[field]: {
					...fieldConfig[field],
					hide: !enabled,
				},
			},
		};

		onConfigChange(newconfig);
	}

	function handleWidthChange(field: string, width: number) {
		onConfigChange({
			...config,
			fieldConfig: {
				...fieldConfig,
				[field]: {
					...fieldConfig[field],
					width,
				},
			},
		});
	}
</script>

<ToolBar>
	<p />
	<HorizontalGroup>
		<SwitchSelect
			label={$i18n.t("views.table.hide-fields")}
			items={columns.map((column) => ({
				label: column.field,
				value: column.field,
				enabled: !column.hide,
			}))}
			onChange={handleVisibilityChange}
		/>
	</HorizontalGroup>
</ToolBar>
<div>
	<DataGrid
		{columns}
		{rows}
		{readonly}
		onRowAdd={() => {
			new CreateRecordModal(
				$app,
				workspace,
				(name, templatePath, workspace) => {
					onRecordAdd(
						createDataRecord(name, workspace),
						templatePath
					);
				}
			).open();
		}}
		onRowEdit={(id, values) => {
			new ConfigureRecord($app, fields, onRecordUpdate, {
				id,
				values,
			}).open();
		}}
		onRowDelete={onRecordDelete}
		onColumnHide={(column) => {
			const fieldConfig = config.fieldConfig;

			onConfigChange({
				...config,
				fieldConfig: {
					...fieldConfig,
					[column.field]: {
						...fieldConfig?.[column.field],
						hide: true,
					},
				},
			});
		}}
		onColumnRename={(field) => {
			new InputDialogModal(
				$app,
				$i18n.t("views.table.rename-field"),
				$i18n.t("views.table.rename"),
				(value) => {
					onFieldRename(field, value);
				},
				field
			).open();
		}}
		onColumnDelete={onFieldDelete}
		onRowChange={(rowId, row) => {
			onRecordUpdate({ id: rowId, values: row });
		}}
		onColumnResize={handleWidthChange}
		onRowNavigate={(rowId, row, openNew) => {
			$app.workspace.openLinkText(rowId, "", openNew);
		}}
		sortModel={{
			field: config?.sortField ?? "name",
			sort: config?.sortAsc ? "asc" : "desc",
		}}
		onSortModelChange={(field, sort) => {
			onConfigChange({
				...config,
				sortField: field,
				sortAsc: sort === "asc",
			});
		}}
	/>
</div>

<style>
	div {
		overflow: auto;
	}
</style>
