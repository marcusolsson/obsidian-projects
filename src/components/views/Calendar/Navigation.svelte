<script lang="ts">
	import { Button } from "../../core/Button";
	import { IconButton } from "../../core/IconButton";

	export let onNext: () => void;
	export let onPrevious: () => void;
	export let onToday: () => void;
</script>

<div>
	<IconButton icon="chevron-left" on:click={onPrevious} />
	<Button on:click={onToday}>Today</Button>
	<IconButton icon="chevron-right" on:click={onNext} />
</div>

<style>
	div {
		display: flex;
		gap: 4px;
		align-items: center;
	}
</style>
