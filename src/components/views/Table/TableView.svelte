<script lang="ts">
	import DataGrid from "src/components/core/DataGrid/DataGrid.svelte";
	import type {
		GridColDef,
		GridRowProps,
	} from "src/components/core/DataGrid/data-grid";
	import {
		DataFieldType,
		type DataField,
		type DataRecord,
	} from "src/lib/data";
	import { app } from "src/lib/stores/obsidian";
	import { api } from "src/lib/stores/api";
	import { ConfigureRecord } from "src/modals/record-modal";
	import type { GridConfig } from "./types";
	import { InputDialogModal } from "src/modals/input-dialog";
	import { normalizePath } from "obsidian";

	export let records: DataRecord[];
	export let fields: DataField[];

	export let config: GridConfig;
	export let onConfigChange: (config: GridConfig) => void;
	export let rootPath: string = "";

	$: columns = [
		{ name: "name", type: DataFieldType.String },
		{ name: "path", type: DataFieldType.String },
		...fields,
	].map<GridColDef>((field) => ({
		field: field.name,
		type: field.type,
		width: config?.fieldWidths?.[field.name] ?? 180,
		editable: field.name !== "name" && field.name !== "path",
		header: field.name === "name",
	}));

	$: rows = records.map<GridRowProps>((record) => ({
		rowId: record.path,
		row: { ...record.values, name: record.name, path: record.path },
	}));
</script>

<DataGrid
	{columns}
	{rows}
	onRowAdd={() => {
		new InputDialogModal(
			$app,
			"Add record",
			"Add",
			(value) => {
				$api.createRecord({
					name: value,
					path: normalizePath(rootPath + "/" + value + ".md"),
					values: {},
				});
			},
			"Untitled"
		).open();
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
	onColumnRename={(field) => {
		new InputDialogModal(
			$app,
			"Rename field",
			"Rename",
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
	onColumnResize={(field, width) =>
		onConfigChange({
			...config,
			fieldWidths: {
				...config?.fieldWidths,
				[field]: width,
			},
		})}
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
