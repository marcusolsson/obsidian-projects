<script lang="ts">
	import { onMount } from "svelte";
	import { TextInput } from "obsidian-svelte";

	export let value: string;
	export let onChange: (value: string) => void;

	let ref: HTMLInputElement;

	function handleInput(event: Event) {
		if (event.currentTarget instanceof HTMLInputElement) {
			value = event.currentTarget.value;
			onChange(value);
		}
	}

	onMount(() => {
		ref.focus();
	});
</script>

<TextInput bind:value bind:ref embed on:change={handleInput} on:blur />
