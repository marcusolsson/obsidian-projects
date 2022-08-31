<script lang="ts">
	import { isDate } from "src/lib/datasource";

	import { DatePicker } from "../../../../core/DatePicker";

	import { GridCell } from "../";
	import { TextLabel } from "../";

	export let value: Date | undefined;
	export let width: number;
	export let onChange: (value: Date) => void;
</script>

<GridCell {width} on:mousedown>
	<svelte:fragment slot="read">
		{#if isDate(value)}
			<TextLabel slot="read" value={value.toLocaleDateString()} />
		{/if}
	</svelte:fragment>
	<DatePicker slot="edit" value={value ?? null} onCommit={onChange} />
</GridCell>
