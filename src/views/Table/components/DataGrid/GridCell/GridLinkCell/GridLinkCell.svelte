<script lang="ts">
	import { getContext } from "svelte";
	import { TFile } from "obsidian";
	import { FileAutocomplete } from "obsidian-svelte";

	import { isOptionalLink, type Link } from "../../../../../../lib/data";

	import type { GridColDef } from "../../data-grid";

	import LinkLabel from "./LinkLabel.svelte";
	import { GridCell } from "..";
	import { app } from "../../../../../../lib/stores/obsidian";
	import { getNotesInFolder } from "src/lib/obsidian";

	export let value: Link | undefined;
	export let onChange: (value: Link | undefined) => void;
	export let column: GridColDef;
	export let rowindex: number;
	export let colindex: number;
	export let selected: boolean;

	const sourcePath = getContext<string>("sourcePath");

	let edit = false;
</script>

<GridCell
	{selected}
	{rowindex}
	{colindex}
	{edit}
	onEditChange={(value) => (edit = value)}
	{column}
	on:mousedown
	on:navigate
>
	<svelte:fragment slot="read">
		{#if isOptionalLink(value)}
			<LinkLabel {value} />
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="edit">
		{#if isOptionalLink(value)}
			<FileAutocomplete
				files={getNotesInFolder($app.vault.getRoot())}
				value={value?.linkText ?? ""}
				embed
				autoFocus
				width="100%"
				on:blur={() => {
					edit = false;
				}}
				on:change={({ detail: linkText }) => {
					onChange(
						linkText
							? {
									linkText,
									sourcePath,
							  }
							: undefined
					);
				}}
				getLabel={(file) =>
					file instanceof TFile ? file.basename : ""}
				getDescription={(file) =>
					file.path.split("/").slice(0, -1).join("/")}
			/>
		{/if}
	</svelte:fragment>
</GridCell>
