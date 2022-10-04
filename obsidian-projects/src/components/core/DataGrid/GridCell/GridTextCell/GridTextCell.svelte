<script lang="ts">
	import { GridCell } from "..";
	import type { GridColDef } from "../../data-grid";

	import TextInput from "./TextInput.svelte";
	import TextLabel from "./TextLabel.svelte";

	export let value: string | undefined;
	export let onChange: (value: string) => void;
	export let column: GridColDef;

	let edit: boolean = false;
	let selected: boolean = false;
</script>

<GridCell bind:edit bind:selected {column} on:mousedown>
	<TextLabel slot="read" value={value || ""} />
	<TextInput
		on:blur={() => {
			selected = false;
			edit = false;
		}}
		slot="edit"
		value={value || ""}
		{onChange}
	/>
</GridCell>
