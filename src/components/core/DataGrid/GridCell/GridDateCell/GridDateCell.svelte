<script lang="ts">
	import { isDate, type DataValue } from "src/lib/datasource";

	import { DatePicker } from "../../../../core/DatePicker";

	import { GridCell } from "../";
	import { TextLabel } from "../";

	export let value: DataValue;
	export let width: number;
	export let onChange: (value: Date) => void;
</script>

{#if isDate(value)}
	<GridCell {width} on:mousedown>
		<TextLabel slot="read" value={value.toLocaleDateString()} />
		<DatePicker slot="edit" {value} onCommit={onChange} />
	</GridCell>
{:else}
	<GridCell {width} on:mousedown>
		<DatePicker slot="edit" value={undefined} onCommit={onChange} />
	</GridCell>
{/if}
