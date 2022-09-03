<script lang="ts">
	import type { DataRecord } from "src/lib/data";

	export let description: string;
	export let onDrop: (record: DataRecord) => void;

	let hover: boolean = false;

	function handleDrop(event: DragEvent) {
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = "move";

			const data = JSON.parse(
				event.dataTransfer.getData("application/json")
			);

			onDrop(data);

			hover = false;
		}
	}
</script>

<div
	class:hover
	on:dragleave={() => {
		hover = false;
	}}
	on:dragenter={() => {
		hover = true;
	}}
	on:drop|preventDefault={(event) => handleDrop(event)}
	on:dragover|preventDefault
>
	{description}
</div>

<style>
	div {
		border-radius: var(--radius-m);
		background: var(--background-primary);
		color: var(--text-faint);
		width: 100%;
		height: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hover {
		background-color: var(--background-modifier-hover);
	}
</style>
