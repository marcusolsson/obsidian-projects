<script lang="ts">
	import { GridCell } from "../";

	import TextInput from "./TextInput.svelte";
	import TextLabel from "./TextLabel.svelte";

	export let value: string | undefined;
	export let width: number;
	export let editable: boolean;
	export let onChange: (value: string) => void;
</script>

<GridCell {editable} {width} on:mousedown>
	<TextLabel slot="read" value={value || ""} />
	<TextInput slot="edit" value={value || ""} {onChange} />
</GridCell>
