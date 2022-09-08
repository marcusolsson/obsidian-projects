<script lang="ts">
	import { onMount } from "svelte";

	import Popover from "svelte-easy-popover";

	interface Suggestion {
		id: string;
		title: string;
		note: string;
	}

	export let value: string;
	export let onChange: (value: string) => void;
	export let onSuggest: (value: string) => Suggestion[];

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
	on:input={() => {
		suggestions = onSuggest(value);
	}}
	bind:this={referenceElement}
	on:focus={() => (isOpen = true)}
	on:blur={() => {
		isOpen = false;
		onChange(value);
	}}
/>
<Popover
	on:change={(isOpen) => {
		if (isOpen) {
			suggestions = onSuggest(value);
		}
	}}
	{isOpen}
	{referenceElement}
	placement="bottom-start"
	spaceAway={5}
>
	<div class="suggestion-container" style={`min-width: 200px`}>
		<div class="suggestion">
			{#each suggestions as { id, title, note }, i}
				<div
					class="suggestion-item mod-complex"
					class:is-selected={selected === i}
					on:mouseenter={() => (selected = i)}
					on:mouseleave={() => (selected = -1)}
					on:mousedown={() => {
						value = title;
					}}
				>
					<div class="suggestion-content">
						<div class="suggestion-title">{title}</div>
						<div class="suggestion-note">{note}</div>
					</div>
					<div class="suggestion-aux" />
				</div>
			{/each}
		</div>
	</div>
</Popover>

<style>
	input {
		all: unset;
		background-color: var(--background-primary);
		box-sizing: border-box;
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
