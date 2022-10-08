<script lang="ts">
	import { Autocomplete } from "obsidian-svelte";
	import type { TAbstractFile } from "obsidian";

	/**
	 * Specify the text input value.
	 */
	export let value: string;

	/**
	 * Specify the files to select from.
	 */
	export let files: TAbstractFile[];

	/**
	 * Specify a function to format the label.
	 */
	export let getLabel: (file: TAbstractFile) => string = (file) => file.name;

	/**
	 * Specify a function to format the description.
	 */
	export let getDescription: (file: TAbstractFile) => string = () => "";

	/**
	 * Input props.
	 */
	export let embed: boolean = false;
	export let readonly: boolean = false;
	export let placeholder: string = "";
	export let width: string = "auto";
	export let autoFocus: boolean = false;

	$: options = files.map((file) => ({
		label: getLabel(file),
		description: getDescription(file),
	}));
</script>

<Autocomplete
	bind:value
	bind:options
	on:change
	{readonly}
	{placeholder}
	{width}
	{embed}
	{autoFocus}
/>
