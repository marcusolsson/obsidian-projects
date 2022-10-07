<script lang="ts">
	import { createEventDispatcher } from "svelte";
	export let checked: boolean;

	const dispatch = createEventDispatcher<{ check: boolean }>();

	$: dispatch("check", checked);

	function handleChange(event: Event) {
		if (event.currentTarget instanceof HTMLInputElement) {
			checked = event.currentTarget.checked;
		}
	}
</script>

<input
	type="checkbox"
	{checked}
	on:dblclick|stopPropagation
	on:click|stopPropagation
	on:change={handleChange}
/>
