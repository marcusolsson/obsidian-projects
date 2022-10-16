<script lang="ts">
	import type dayjs from "dayjs";

	import type { DataRecord, DataValue } from "../../lib/data";

	import CalendarDate from "./CalendarDate.svelte";
	import CalendarEntry from "./CalendarEntry.svelte";
	import { TableCell } from "./components/Table";
	import { i18n } from "../../lib/stores/i18n";
	import { app } from "../../lib/stores/obsidian";
	import path from "path";
	import { Menu } from "obsidian";
	import { InternalLink } from "obsidian-svelte";

	export let date: dayjs.Dayjs;
	export let records: Array<[number, DataRecord]>;
	export let checkField: string | undefined;
	export let onEntryClick: (recordId: number) => void;
	export let onEntryAdd: () => void;
	export let onRecordUpdate: (record: DataRecord) => void;

	function getDisplayName(record: DataRecord): string {
		const basename = path.basename(record.id);
		return basename.slice(0, basename.lastIndexOf("."));
	}

	function asOptionalBoolean(value: DataValue): boolean | null {
		if (typeof value === "boolean") {
			return value;
		}
		return null;
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
					checked={checkField !== undefined
						? asOptionalBoolean(recordPair[1].values[checkField])
						: undefined}
					on:check={({ detail: checked }) => {
						if (checkField) {
							onRecordUpdate({
								...recordPair[1],
								values: {
									...recordPair[1].values,
									[checkField]: checked,
								},
							});
						}
					}}
					on:click={() => {
						onEntryClick(recordPair[0]);
					}}
				>
					<InternalLink
						linkText={recordPair[1].id}
						sourcePath=""
						resolved
						on:open={({
							detail: { linkText, sourcePath, newLeaf },
						}) => {
							if (newLeaf) {
								$app.workspace.openLinkText(
									linkText,
									sourcePath,
									newLeaf
								);
							} else {
								onEntryClick(recordPair[0]);
							}
						}}
					>
						{getDisplayName(recordPair[1])}
					</InternalLink>
				</CalendarEntry>
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
