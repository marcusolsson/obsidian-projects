<script lang="ts">
	export let title: string;
	export let note: string = "";
	export let selected: boolean;
	export let onClick: () => void;
	export let onSelect: () => void;

	let ref: HTMLDivElement;

	$: {
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
		onSelect();
	}}
	on:mouseleave={() => (selected = false)}
	on:mousedown={() => onClick()}
>
	<div class="suggestion-content">
		<div class="suggestion-title">{title}</div>
		<div class="suggestion-note">{note}</div>
	</div>
	<div class="suggestion-aux" />
</div>
