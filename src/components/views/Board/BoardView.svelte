<script lang="ts">
	import {
		DataFieldType,
		isString,
		type DataField,
		type DataRecord,
	} from "../../../lib/datasource";
	import { api } from "../../../lib/stores";

	import { Button } from "../../core/Button";
	import { Field } from "../../core/Field";
	import { HorizontalGroup } from "../../core/HorizontalGroup";
	import { Select } from "../../core/Select";
	import { ToolBar } from "../../core/ToolBar";

	import BoardCard from "./BoardCard.svelte";
	import BoardColumn from "./BoardColumn.svelte";

	import { ConfigureRecord } from "../../../modals/record-modal";

	import { get } from "svelte/store";
	import { app } from "../../../lib/stores";
	import { fieldToSelectableValue } from "src/lib/helpers";
	import { groupRecordsByField, unique } from "./board";

	interface BoardConfig {
		groupByField?: string;
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
		return () =>
			new ConfigureRecord(get(app), fields, (record) => {
				// dataFrame.appendRecord(record);
			}).open();
	}
</script>

<div>
	<ToolBar>
		{#if groupByField}
			<Field name="Group by">
				<Select
					value={groupByField.name}
					options={textFields.map(fieldToSelectableValue)}
					onChange={(value) =>
						onConfigChange({
							...config,
							groupByField: value,
						})}
				/>
			</Field>
		{/if}
	</ToolBar>
	<HorizontalGroup alignItems="flex-start">
		{#each columns.sort() as column}
			<BoardColumn name={column}>
				{#each groupedRecords[column] ?? [] as record}
					{#if record[1].name}
						<BoardCard on:click={handleRecordClick(record[1])}>
							{record[1].name}
						</BoardCard>
					{/if}
				{/each}
				<Button variant="plain" on:click={handleRecordAdd(column)}>
					Add a record
				</Button>
			</BoardColumn>
		{/each}
	</HorizontalGroup>
</div>

<style>
	div {
		background-color: var(--background-secondary-alt);
		height: 100%;
	}
</style>
