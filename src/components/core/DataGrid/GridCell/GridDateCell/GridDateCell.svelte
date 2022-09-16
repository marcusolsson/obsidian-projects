<script lang="ts">
	import { isDate } from "src/lib/data";

	import { DatePicker } from "../../../../core/DatePicker";

	import { GridCell } from "../";
	import { TextLabel } from "../";
	import type { GridColDef } from "../../data-grid";

	export let value: Date | undefined;
	export let onChange: (value: Date) => void;
	export let column: GridColDef;
</script>

<GridCell {column} on:mousedown>
	<svelte:fragment slot="read">
		{#if isDate(value)}
			<TextLabel value={value.toLocaleDateString()} />
		{/if}
	</svelte:fragment>
	<DatePicker slot="edit" embed value={value ?? null} onCommit={onChange} />
</GridCell>
