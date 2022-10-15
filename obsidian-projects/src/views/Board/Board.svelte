<script lang="ts">
	import type { DataRecord } from "../../lib/data";

	import BoardColumn from "./BoardColumn.svelte";

	export let columns: {
		id: string;
		name: string;
		records: DataRecord[];
	}[];

	export let groupByPriority: string | undefined;
	export let readonly: boolean;
	export let onRecordClick: (record: DataRecord) => void;
	export let onRecordAdd: (column: string) => void;
</script>

<div>
	{#each columns as column (column.name)}
		<BoardColumn
			{readonly}
			name={column.name}
			records={column.records}
			{groupByPriority}
			{onRecordClick}
			onRecordAdd={() => onRecordAdd(column.name)}
		/>
	{/each}
</div>

<style>
	div {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		padding: 8px;
	}
</style>
