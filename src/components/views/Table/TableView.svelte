<script lang="ts">
	import { normalizePath } from "obsidian";
	import type {
		GridColDef,
		GridRowProps,
	} from "src/components/core/DataGrid/data-grid";

	import DataGrid from "src/components/core/DataGrid/DataGrid.svelte";
	import HorizontalGroup from "src/components/core/HorizontalGroup/HorizontalGroup.svelte";
	import SwitchSelect from "src/components/core/SwitchSelect/SwitchSelect.svelte";
	import ToolBar from "src/components/core/ToolBar/ToolBar.svelte";

	import { i18n } from "src/lib/stores/i18n";
	import { api } from "src/lib/stores/api";
	import { app } from "src/lib/stores/obsidian";
	import {
		DataFieldType,
		type DataField,
		type DataRecord,
	} from "src/lib/types";

	import { CreateRecordModal } from "src/modals/create-record-modal";
	import { InputDialogModal } from "src/modals/input-dialog";
	import { ConfigureRecord } from "src/modals/record-modal";
	import type { WorkspaceDefinition } from "src/main";
	import type { GridConfig } from "./types";

	export let records: DataRecord[];
	export let fields: DataField[];

	export let config: GridConfig;
	export let onConfigChange: (config: GridConfig) => void;
	export let workspace: WorkspaceDefinition;

	$: fieldConfig = config?.fieldConfig ?? {};

	$: columns = [
		{ name: "name", type: DataFieldType.String },
		{ name: "path", type: DataFieldType.String },
		...fields,
	].map<GridColDef>((field) => ({
		field: field.name,
		type: field.type,
		width: fieldConfig[field.name]?.width ?? 180,
		hide: fieldConfig[field.name]?.hide ?? false,
		editable: field.name !== "name" && field.name !== "path",
	}));

	$: rows = records.map<GridRowProps>((record) => ({
		rowId: record.path,
		row: { ...record.values, name: record.name, path: record.path },
	}));

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
			label={$i18n.t("hide-fields")}
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
		onRowAdd={() => {
			new CreateRecordModal($app, workspace, (name, templatePath) => {
				$api.createRecord(
					{
						name,
						path: normalizePath(
							workspace.path + "/" + name + ".md"
						),
						values: {},
					},
					templatePath
				);
			}).open();
		}}
		onRowEdit={(id, row) => {
			const { name, path, ...values } = row;
			new ConfigureRecord(
				$app,
				fields,
				(record) => {
					$api.updateRecord(record);
				},
				{ path: id, name, values }
			).open();
		}}
		onRowDelete={(rowId) => {
			$api.deleteRecord(rowId);
		}}
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
				$i18n.t("rename-field"),
				$i18n.t("rename"),
				(value) => {
					$api.renameField(field, value);
				},
				field
			).open();
		}}
		onColumnDelete={(field) => {
			$api.deleteField(field);
		}}
		onRowChange={(rowId, row) => {
			const { name, path, ...values } = row;
			$api.updateRecord({ path, name, values });
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
