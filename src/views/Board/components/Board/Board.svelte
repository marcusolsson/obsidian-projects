<script lang="ts">
	import type { DataRecord } from "../../../../lib/data";

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
	export let columnWidth: number;
</script>

<div
	style={`grid-template-columns: repeat(${columns.length}, ${columnWidth}px);`}
>
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
		display: grid;
		column-gap: 8px;
		align-items: flex-start;
	}
</style>
