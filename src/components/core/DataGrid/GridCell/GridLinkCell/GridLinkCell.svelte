<script lang="ts">
	import { isLink, type Link } from "src/lib/data";

	import { GridCell } from "../";
	import type { GridColDef } from "../../data-grid";
	import TextInput from "../GridTextCell/TextInput.svelte";

	import LinkLabel from "./LinkLabel.svelte";

	export let value: Link | undefined;
	export let onChange: (value: Link) => void;
	export let column: GridColDef;
</script>

<GridCell {column} on:mousedown>
	<svelte:fragment slot="read">
		{#if isLink(value)}
			<LinkLabel slot="read" {value} />
		{/if}
	</svelte:fragment>

	<TextInput
		slot="edit"
		value={value?.linkText ?? ""}
		onChange={(linkText) => {
			// TODO: Get source path from current record.
			onChange({ sourcePath: value?.sourcePath ?? "", linkText });
		}}
	/>
</GridCell>
