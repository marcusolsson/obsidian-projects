<script lang="ts">
	import type dayjs from "dayjs";

	import type { DataRecord } from "../../../lib/types";

	import CalendarDate from "./CalendarDate.svelte";
	import CalendarEntry from "./CalendarEntry.svelte";
	import { TableCell } from "./components/Table";
	import { i18n } from "../../../lib/stores/i18n";
	import path from "path";
	import { Menu } from "obsidian";

	export let date: dayjs.Dayjs;
	export let records: Array<[number, DataRecord]>;
	export let onEntryClick: (recordId: number) => void;
	export let onEntryAdd: () => void;

	function getDisplayName(record: DataRecord): string {
		const basename = path.basename(record.id);
		return basename.slice(0, basename.lastIndexOf("."));
	}
</script>

<TableCell
	width="calc(100% / 7)"
	on:dblclick={() => onEntryAdd()}
	on:mousedown={(event) => {
		if (event.button === 2) {
			const menu = new Menu();

			menu.addItem((item) => {
				item.setTitle($i18n.t("views.calendar.new-note"))
					.setIcon("file")
					.onClick(onEntryAdd);
			});

			menu.showAtMouseEvent(event);
		}
	}}
>
	<div class:weekend={date.day() === 0 || date.day() === 6}>
		<CalendarDate {date} />
		{#each records as recordPair}
			{#if getDisplayName(recordPair[1])}
				<CalendarEntry
					name={getDisplayName(recordPair[1])}
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
		overflow: scroll;
	}

	.weekend {
		background-color: var(--background-secondary);
	}
</style>
