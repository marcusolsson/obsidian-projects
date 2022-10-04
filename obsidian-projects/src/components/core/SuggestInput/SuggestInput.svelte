<script lang="ts">
	import SuggestionMenu from "../Menu/SuggestionMenu.svelte";
	import SuggestionMenuItem from "../Menu/SuggestionMenuItem.svelte";

	interface Suggestion {
		id: string;
		title: string;
		note: string;
	}

	export let value: string;
	export let onChange: (value: string) => void;
	export let onSuggest: (value: string) => Promise<Suggestion[]>;
	export let embed: boolean = false;
	export let disabled: boolean = false;
	export let placeholder: string = "";
	export let fullWidth: boolean = false;
	export let maxItems: number = 50;

	let isOpen = false;

	let referenceElement: HTMLInputElement;
	let suggestions: Suggestion[] = [];

	let selected: number = -1;
</script>

<input
	bind:value
	class:embed
	class:fullWidth
	type="text"
	{disabled}
	{placeholder}
	on:input={async () => {
		const suggs = await onSuggest(value);
		suggestions = suggs.slice(0, Math.min(maxItems, suggs.length));
		isOpen = !!suggestions.length;
		if (selected < 0 && suggestions.length) {
			selected = 0;
		}
	}}
	bind:this={referenceElement}
	on:focus={async () => {
		if (!value) {
			const suggs = await onSuggest(value);
			suggestions = suggs.slice(0, Math.min(maxItems, suggs.length));
			isOpen = !!suggestions.length;
			if (selected < 0 && suggestions.length) {
				selected = 0;
			}
		}
	}}
	on:blur={() => {
		isOpen = false;
		onChange(value);
	}}
	on:keydown={(event) => {
		if (isOpen) {
			if (event.key === "ArrowUp") {
				const prev = selected - 1;
				selected = prev < 0 ? suggestions.length - 1 : prev;
				event.preventDefault();
			} else if (event.key === "ArrowDown") {
				const next = selected + 1;
				selected = next > suggestions.length - 1 ? 0 : next;
				event.preventDefault();
			} else if (event.key === "Enter") {
				value = suggestions[selected]?.title ?? value;
				isOpen = false;
				onChange(value);
				event.preventDefault();
			}
		}
	}}
/>

<SuggestionMenu
	anchorEl={referenceElement}
	open={isOpen}
	onClose={() => {
		isOpen = false;
	}}
>
	{#each suggestions as { title, note }, i}
		<SuggestionMenuItem
			{title}
			{note}
			selected={selected === i}
			onClick={() => {
				selected = i;
				value = suggestions[selected]?.title ?? value;
				isOpen = false;
			}}
			onSelect={() => (selected = i)}
		/>
	{/each}
</SuggestionMenu>

<style>
	.fullWidth {
		width: 100%;
	}

	.embed {
		all: unset;
		background-color: var(--background-primary);
		width: 100%;
		padding: 6px;
		font-weight: 400;
		font-family: var(--font-default);
		color: var(--text-normal);
	}

	input:focus {
		box-shadow: none;
	}

	input:hover {
		background-color: transparent;
	}
</style>
