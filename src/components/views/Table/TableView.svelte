<script lang="ts">
	import path from "path";
	import DataGrid from "src/components/core/DataGrid/DataGrid.svelte";
	import type {
		GridRowProps,
		GridColDef,
	} from "src/components/core/DataGrid/types";
	import {
		DataFieldType,
		type DataField,
		type DataRecord,
	} from "src/lib/datasource";
	import { api, app } from "src/lib/stores";
	import { ConfigureRecord } from "src/modals/record-modal";
	import type { GridConfig } from "./types";

	export let records: DataRecord[];
	export let fields: DataField[];

	export let config: GridConfig;
	export let onConfigChange: (config: GridConfig) => void;

	$: columns = [
		{ name: "name", type: DataFieldType.String },
		{ name: "path", type: DataFieldType.String },
		...fields,
	].map<GridColDef>((field) => ({
		field: field.name,
		type: field.type,
		width: config?.fieldWidths?.[field.name] ?? 180,
		editable: field.name !== "name" && field.name !== "path",
	}));

	$: rows = records.map<GridRowProps>((record) => ({
		rowId: record.path,
		row: { ...record.values, name: record.name, path: record.path },
	}));
</script>

<DataGrid
	{columns}
	{rows}
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
				...config.fieldWidths,
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
