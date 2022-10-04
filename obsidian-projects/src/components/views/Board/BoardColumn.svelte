<script lang="ts">
	import { Button, Typography } from "obsidian-svelte";
	import path from "path";
	import { i18n } from "../../../lib/stores/i18n";

	import { isNumber, type DataRecord } from "../../../lib/types";
	import Card from "./Card.svelte";
	import CardList from "./CardList.svelte";

	export let name: string;
	export let records: DataRecord[];
	export let groupByPriority: string | undefined;
	export let readonly: boolean;

	$: prioritized = getPrioritizedRecords(records);
	$: unprioritized = getUnprioritizedRecords(records);

	export let onRecordClick: (record: DataRecord) => void;
	export let onRecordAdd: () => void;

	function getPrioritizedRecords(records: DataRecord[]): DataRecord[] {
		return records.filter((record) => {
			return groupByPriority && isNumber(record.values[groupByPriority]);
		});
	}

	function getUnprioritizedRecords(records: DataRecord[]): DataRecord[] {
		return records.filter((record) => {
			return groupByPriority && !isNumber(record.values[groupByPriority]);
		});
	}

	function getDisplayName(record: DataRecord): string {
		const basename = path.basename(record.id);
		return basename.slice(0, basename.lastIndexOf("."));
	}
</script>

<div class="column">
	<div class="column-section">
		<Typography variant="label" nomargin>{name}</Typography>
	</div>
	{#if groupByPriority}
		{#if prioritized.length}
			<div class="column-section">
				<CardList>
					{#each prioritized as record}
						<Card
							name={getDisplayName(record)}
							on:click={() => onRecordClick(record)}
						/>
					{/each}
				</CardList>
			</div>
		{/if}
		{#if unprioritized.length}
			<div class="column-section unprio">
				<p>{$i18n.t("views.board.unprioritized")}</p>
				<CardList>
					{#each unprioritized as record}
						<Card
							name={getDisplayName(record)}
							on:click={() => onRecordClick(record)}
						/>
					{/each}
				</CardList>
			</div>
		{/if}
	{:else}
		<div class="column-section">
			<CardList>
				{#each records as record}
					<Card
						name={getDisplayName(record)}
						on:click={() => onRecordClick(record)}
					/>
				{/each}
			</CardList>
		</div>
	{/if}
	{#if !readonly}
		<div class="column-section">
			<Button
				variant="plain"
				on:click={() => {
					onRecordAdd();
				}}
			>
				{$i18n.t("views.board.note.add")}
			</Button>
		</div>
	{/if}
</div>

<style>
	.column {
		min-width: 350px;
		border: 1px solid var(--background-modifier-border);
		border-radius: var(--radius-m);
		background-color: var(--background-secondary);
		display: flex;
		flex-direction: column;
	}

	.column-section {
		padding: var(--size-4-2);
		display: flex;
		flex-direction: column;
	}

	.unprio {
		border-top: 1px solid var(--background-modifier-border);
	}

	p {
		font-weight: 500;
		margin: 0;
		margin-bottom: 4px;
		color: var(--text-faint);
		font-size: var(--font-smaller);
	}
</style>
