<script lang="ts">
	import { GridCell } from "..";
	import type { GridColDef } from "../../data-grid";

	import { TextInput } from "obsidian-svelte";
	import TextLabel from "./TextLabel.svelte";

	export let value: string | undefined;
	export let onChange: (value: string | undefined) => void;
	export let column: GridColDef;
	export let colindex: number;

	let edit: boolean = false;
	let selected: boolean = false;
</script>

<GridCell
	bind:edit
	bind:selected
	{column}
	{colindex}
	on:mousedown
	onCopy={() => {
		navigator.clipboard.writeText(value?.toString() ?? "");
	}}
	onCut={() => {
		navigator.clipboard.writeText(value?.toString() ?? "");
		onChange(undefined);
	}}
	onPaste={async () => {
		onChange(await navigator.clipboard.readText());
	}}
>
	<TextLabel slot="read" value={value || ""} />
	<TextInput
		autoFocus
		slot="edit"
		value={value || ""}
		embed
		on:input={({ detail }) => (value = detail)}
		on:blur={(event) => {
			if (
				event.currentTarget instanceof HTMLInputElement &&
				event.relatedTarget instanceof HTMLDivElement &&
				!event.relatedTarget.contains(event.currentTarget)
			) {
				selected = false;
				edit = false;

				onChange(value);
			}
		}}
	/>
</GridCell>
