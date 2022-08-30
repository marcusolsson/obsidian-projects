<script lang="ts">
	import type { Suggestion } from "src/lib/suggest";

	import SuggestItem from "./SuggestItem.svelte";

	export let left: number;
	export let top: number;

	export let suggestions: Suggestion[] = [];
</script>

<div class="suggestion-container" style={`left: ${left}px; top: ${top}px;`}>
	<div class="suggestion">
		{#each suggestions as { title, note }}
			<SuggestItem {title} {note} />
		{/each}
	</div>
</div>

<style>
	.suggestion-container {
	}
</style>
