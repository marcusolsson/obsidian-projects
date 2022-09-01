<script lang="ts">
	import type { DataRecord } from "src/lib/datasource";

	export let record: DataRecord;
</script>

<div on:click>
	{record.name}
</div>

<style>
	div {
		background-color: var(--background-primary);
		border-radius: var(--radius-s);
		border: 1px solid var(--background-modifier-border);
		padding: var(--size-4-2);
	}
</style>
