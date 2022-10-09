<script lang="ts">
	import type {
		GridColDef,
		GridRowProps,
	} from "./components/DataGrid/data-grid";

	import DataGrid from "./components/DataGrid/DataGrid.svelte";
	import SwitchSelect from "./components/SwitchSelect/SwitchSelect.svelte";

	import { i18n } from "../../lib/stores/i18n";
	import { app } from "../../lib/stores/obsidian";

	import { CreateNoteModal } from "../../modals/create-note-modal";
	import { InputDialogModal } from "../../modals/input-dialog";
	import { EditNoteModal } from "../../modals/edit-note-modal";
	import { createDataRecord } from "../../lib/api";

	import type { DataFrame } from "../../lib/data";
	import type { ProjectDefinition } from "../../types";
	import type { GridConfig } from "./types";
	import { HorizontalGroup } from "obsidian-projects/src/components/HorizontalGroup";
	import { ToolBar } from "obsidian-projects/src/components/ToolBar";
	import type { ViewApi } from "obsidian-projects/src/app/view-api";

	export let project: ProjectDefinition;
	export let frame: DataFrame;
	export let readonly: boolean;
	export let api: ViewApi;

	export let config: GridConfig | undefined;
	export let onConfigChange: (cfg: GridConfig) => void;

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
			new CreateNoteModal(
				$app,
				project,
				(name, templatePath, project) => {
					api.addRecord(
						createDataRecord(name, project),
						templatePath
					);
				}
			).open();
		}}
		onRowEdit={(id, values) => {
			new EditNoteModal(
				$app,
				fields,
				(record) => {
					api.updateRecord(record, fields);
				},
				{
					id,
					values,
				}
			).open();
		}}
		onRowDelete={(id) => {
			api.deleteRecord(id);
		}}
		onColumnHide={(column) => {
			const fieldConfig = config?.fieldConfig;

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
					api.renameField(field, value);
				},
				field
			).open();
		}}
		onColumnDelete={(field) => {
			api.deleteField(field);
		}}
		onRowChange={(rowId, row) => {
			api.updateRecord({ id: rowId, values: row }, fields);
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
