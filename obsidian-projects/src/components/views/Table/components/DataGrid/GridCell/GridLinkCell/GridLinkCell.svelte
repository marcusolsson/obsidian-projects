<script lang="ts">
	import { getContext } from "svelte";
	import { isOptionalLink, type Link } from "../../../../../../../lib/types";

	import type { GridColDef } from "../../data-grid";

	import { FileAutocomplete } from "../../../../../../core/SuggestInput";
	import LinkLabel from "./LinkLabel.svelte";
	import { GridCell } from "..";
	import { getNotesInFolder } from "obsidian-projects/src/components/app";
	import { app } from "../../../../../../../lib/stores/obsidian";
	import { TFile } from "obsidian";

	export let value: Link | undefined;
	export let onChange: (value: Link | undefined) => void;
	export let column: GridColDef;

	const sourcePath = getContext<string>("sourcePath");

	let edit = false;
</script>

<GridCell {edit} onEditChange={(value) => (edit = value)} {column} on:mousedown>
	<svelte:fragment slot="read">
		{#if isOptionalLink(value)}
			<LinkLabel {value} />
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="edit">
		{#if isOptionalLink(value)}
			<FileAutocomplete
				files={getNotesInFolder($app.vault.getRoot(), false)}
				embed
				value={value?.linkText ?? ""}
				autoFocus
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
				getOptionLabel={(file) =>
					file instanceof TFile ? file.basename : ""}
				getOptionDescription={(file) =>
					file.path.split("/").slice(0, -1).join("/")}
			/>
		{/if}
	</svelte:fragment>
</GridCell>
