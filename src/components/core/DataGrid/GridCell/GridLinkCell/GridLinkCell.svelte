<script lang="ts">
	import { isLink, type Link } from "src/lib/datasource";

	import { GridCell } from "../";
	import TextInput from "../GridTextCell/TextInput.svelte";

	import LinkLabel from "./LinkLabel.svelte";

	export let value: Link | undefined;
	export let width: number;

	export let onChange: (value: Link) => void;
</script>

<GridCell {width} on:mousedown>
	<svelte:fragment slot="read">
		{#if isLink(value)}
			<LinkLabel slot="read" {value} />
		{/if}
	</svelte:fragment>

	<TextInput
		slot="edit"
		value={value?.linkText ?? ""}
		onChange={(linkText) => {
			onChange({
				sourcePath: "",
				linkText,
			});
		}}
	/>
</GridCell>
