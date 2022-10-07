<script lang="ts">
	import { Autocomplete } from "obsidian-svelte";
	import type { TAbstractFile } from "obsidian";

	export let value: string;
	export let files: TAbstractFile[];
	export let getOptionLabel: (file: TAbstractFile) => string = (file) =>
		file.name;
	export let getOptionDescription: (file: TAbstractFile) => string = () => "";
	export let embed: boolean = false;
	export let readonly: boolean = false;
	export let placeholder: string = "";
	export let width: string = "auto";
	export let autoFocus: boolean = false;

	$: options = files.map((file) => ({
		label: getOptionLabel(file),
		description: getOptionDescription(file),
	}));
</script>

<Autocomplete
	bind:value
	bind:options
	{readonly}
	on:change
	{placeholder}
	{width}
	{embed}
	{autoFocus}
/>
