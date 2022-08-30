<script lang="ts">
	import { isString, type DataValue } from "src/lib/datasource";

	import { GridCell } from "../";

	import TextInput from "./TextInput.svelte";
	import TextLabel from "./TextLabel.svelte";

	export let value: DataValue;
	export let width: number;
	export let editable: boolean;
	export let onChange: (value: string) => void;
</script>

{#if isString(value)}
	<GridCell {editable} {width} on:mousedown>
		<TextLabel slot="read" {value} />
		<TextInput slot="edit" {value} {onChange} />
	</GridCell>
{:else}
	<GridCell {editable} {width} on:mousedown>
		<TextInput slot="edit" value="" {onChange} />
	</GridCell>
{/if}
