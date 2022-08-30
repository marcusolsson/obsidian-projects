<script lang="ts">
	import {
		DataFieldType,
		isString,
		type DataField,
		type DataRecord,
	} from "../../../lib/datasource";
	import { api } from "../../../lib/stores";

	import { Button2 } from "../../core/Button2";
	import { Field } from "../../core/Field";
	import { HorizontalGroup } from "../../core/HorizontalGroup";
	import { Select } from "../../core/Select";
	import { ToolBar } from "../../core/ToolBar";

	import BoardCard from "./BoardCard.svelte";
	import BoardColumn from "./BoardColumn.svelte";

	import { ConfigureRecord } from "../../../modals/record-modal";

	import { get } from "svelte/store";
	import { app } from "../../../lib/stores";

	interface BoardConfig {
		groupByField?: string;
	}

	export let records: DataRecord[];
	export let fields: DataField[];

	export let config: BoardConfig;
	export let onConfigChange: (config: BoardConfig) => void;

	let textFields: DataField[] = fields.filter(
		(field) => field.type === DataFieldType.String
	);

	$: groupByField = config?.groupByField ?? textFields?.[0]?.name;
	$: selectedField = fields.find((field) => field.name === groupByField);

	function unique(records: DataRecord[], fieldName: string): string[] {
		const keys = records
			.map((record) => record.values[fieldName])
			.map((value) => (isString(value) ? value : null))
			.filter((value) => value);

		const set = new Set(keys);

		return [...set];
	}

	$: columns = selectedField ? unique(records, selectedField.name) : [];

	function groupRecordsByField(
		records: DataRecord[],
		fieldName: string
	): Record<string, Array<[number, DataRecord]>> {
		const keys = unique(records, fieldName);

		const res: Record<string, Array<[number, DataRecord]>> = {};
		for (let key of keys) {
			res[key] = [];
		}

		records.forEach((record, id) => {
			if (record.values[fieldName]) {
				res[record.values[fieldName] as string].push([id, record]);
			}
		});

		return res;
	}

	$: groupedRecords = selectedField
		? groupRecordsByField(records, selectedField.name)
		: {};

	function handleRecordClick(record: DataRecord): (event: Event) => void {
		return () => {
			new ConfigureRecord(
				get(app),
				fields,
				(record) => {
					$api.updateRecord(record);
				},
				record
			).open();
		};
	}
</script>

<div>
	<ToolBar>
		<Field name="Group by">
			<Select
				value={groupByField}
				options={textFields
					.map((idx) => fields[idx].name)
					.map((value) => ({ label: value, value }))}
				onChange={(value) =>
					onConfigChange({
						...config,
						groupByField: value,
					})}
			/>
		</Field>
	</ToolBar>
	<HorizontalGroup alignItems="flex-start">
		{#each columns.sort() as column}
			<BoardColumn name={column}>
				{#each groupedRecords[column] as record}
					{#if record[1].name}
						<BoardCard on:click={handleRecordClick(record[1])}>
							{record[1].name}
						</BoardCard>
					{/if}
				{/each}
				<Button2
					icon="plus"
					on:click={() => {
						new ConfigureRecord(get(app), fields, (record) => {
							// dataFrame.appendRecord(record);
						}).open();
					}}
				>
					Add a record
				</Button2>
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
