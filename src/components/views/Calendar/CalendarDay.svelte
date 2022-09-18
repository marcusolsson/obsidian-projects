<script lang="ts">
	import type dayjs from "dayjs";

	import type { DataRecord } from "src/lib/types";

	import CalendarDate from "./CalendarDate.svelte";
	import CalendarEntry from "./CalendarEntry.svelte";
	import { TableCell } from "../../core/Table";

	export let date: dayjs.Dayjs;
	export let records: Array<[number, DataRecord]>;
	export let onEntryClick: (recordId: number) => void;
	export let onEntryAdd: () => void;
</script>

<TableCell width="calc(100% / 7)" on:dblclick={() => onEntryAdd()}>
	<div class:weekend={date.day() === 0 || date.day() === 6}>
		<CalendarDate {date} />
		{#each records as recordPair}
			{#if recordPair[1].name}
				<CalendarEntry
					name={recordPair[1].name}
					on:click={() => {
						onEntryClick(recordPair[0]);
					}}
				/>
			{/if}
		{/each}
	</div>
</TableCell>

<style>
	div {
		padding: 4px;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 4px;
		align-items: start;
	}

	.weekend {
		background-color: var(--background-secondary);
	}
</style>
