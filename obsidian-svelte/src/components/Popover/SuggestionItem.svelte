<script lang="ts">
	import { createEventDispatcher } from "svelte";

	/**
	 * Specifies the suggestion label.
	 */
	export let label: string;

	/**
	 * Specifies the suggestion description.
	 */
	export let description: string = "";

	/**
	 * Specifies whether the suggestion is selected.
	 */
	export let selected: boolean = false;

	const dispatch = createEventDispatcher<{ click: void; select: boolean }>();

	$: dispatch("select", selected);

	let ref: HTMLDivElement;

	$: {
		// Keep selected item visible.
		if (selected && ref) {
			ref.scrollIntoView({
				block: "nearest",
				inline: "nearest",
			});
		}
	}
</script>

<div
	bind:this={ref}
	class="suggestion-item mod-complex"
	class:is-selected={selected}
	on:mouseenter={() => {
		selected = true;
	}}
	on:mouseleave={() => (selected = false)}
	on:mousedown={() => dispatch("click")}
>
	<div class="suggestion-content">
		<div class="suggestion-title">{label}</div>
		<div class="suggestion-note">{description}</div>
	</div>
	<div class="suggestion-aux" />
</div>
