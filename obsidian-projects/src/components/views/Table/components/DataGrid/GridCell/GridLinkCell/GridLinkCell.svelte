<script lang="ts">
	import { getContext } from "svelte";
	import { isOptionalLink, type Link } from "../../../../../../../lib/types";

	import type { GridColDef } from "../../data-grid";

	import { FileSuggestInput } from "../../../../../../core/SuggestInput";
	import LinkLabel from "./LinkLabel.svelte";
	import { GridCell } from "..";

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
