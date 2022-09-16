<script lang="ts">
	import { isOptionalLink, type Link } from "src/lib/data";

	import { GridCell } from "../";
	import type { GridColDef } from "../../data-grid";

	import LinkLabel from "./LinkLabel.svelte";
	import FileSuggestInput from "src/components/core/Suggest/FileSuggestInput.svelte";
	import { getContext } from "svelte";

	export let value: Link | undefined;
	export let onChange: (value: Link) => void;
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
			<FileSuggestInput
				embed
				value={value?.linkText ?? ""}
				onChange={(value, file) => {
					onChange({
						linkText: file?.basename ?? value,
						sourcePath,
					});
					edit = false;
				}}
				{sourcePath}
				include="notes"
				valueType="name"
			/>
		{/if}
	</svelte:fragment>
</GridCell>
