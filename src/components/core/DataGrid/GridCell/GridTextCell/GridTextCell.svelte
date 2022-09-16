<script lang="ts">
	import { GridCell } from "../";
	import type { GridColDef } from "../../data-grid";

	import TextInput from "./TextInput.svelte";
	import TextLabel from "./TextLabel.svelte";

	export let value: string | undefined;
	export let onChange: (value: string) => void;
	export let column: GridColDef;
	let edit = false;
</script>

<GridCell {edit} onEditChange={(value) => (edit = value)} {column} on:mousedown>
	<TextLabel slot="read" value={value || ""} />
	<TextInput
		slot="edit"
		onBlur={() => (edit = false)}
		value={value || ""}
		{onChange}
	/>
</GridCell>
