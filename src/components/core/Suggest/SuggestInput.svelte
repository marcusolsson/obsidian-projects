<script lang="ts">
	import { onMount } from "svelte";

	import SuggestionMenu from "../Menu/SuggestionMenu.svelte";
	import SuggestionMenuItem from "../Menu/SuggestionMenuItem.svelte";

	interface Suggestion {
		id: string;
		title: string;
		note: string;
	}

	export let value: string;
	export let onChange: (value: string) => void;
	export let onSuggest: (value: string) => Suggestion[];
	export let embed: boolean = false;

	let isOpen = false;

	let referenceElement: HTMLInputElement;
	let suggestions: Suggestion[] = [];

	let selected: number = -1;

	onMount(() => {
		referenceElement.focus();
	});
</script>

<input
	bind:value
	class:embed
	type="text"
	on:input={() => {
		suggestions = onSuggest(value);
		isOpen = !!suggestions.length;
	}}
	bind:this={referenceElement}
	on:focus={() => {
		if (!value) {
			suggestions = onSuggest(value);
			isOpen = !!suggestions.length;
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
	input {
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
