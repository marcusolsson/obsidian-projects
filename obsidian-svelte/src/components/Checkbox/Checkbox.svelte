<script lang="ts">
	import { createEventDispatcher } from "svelte";

	/**
	 * Specifies whether the checkbox is checked.
	 */
	export let checked: boolean;

	let ref: HTMLDivElement;

	const dispatch = createEventDispatcher<{ check: boolean }>();

	$: dispatch("check", checked);

	$: {
		if (ref) {
			if (checked) {
				ref.classList.add("is-enabled");
			} else {
				ref.classList.remove("is-enabled");
			}
		}
	}
</script>

<div
	bind:this={ref}
	class="checkbox-container"
	on:click={() => (checked = !checked)}
>
	<input type="checkbox" />
</div>
