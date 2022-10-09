<script lang="ts">
	import produce from "immer";
	import { Button, IconButton, FileAutocomplete } from "obsidian-svelte";
	import { getFilesInFolder } from "../../app";
	import { app } from "../../../lib/stores/obsidian";

	export let paths: string[];
	export let onPathsChange: (value: string[]) => void;
</script>

{#each paths as path, i}
	<div>
		<FileAutocomplete
			value={path}
			on:change={({ detail: value }) => {
				onPathsChange(
					produce(paths, (draft) => {
						draft[i] = value;
						return draft;
					})
				);
			}}
			files={getFilesInFolder($app.vault.getRoot())}
			getLabel={(file) => file.path}
			width="100%"
		/>
		<IconButton
			icon="x"
			on:click={() => {
				onPathsChange(paths.filter((_, j) => j !== i));
			}}
		/>
	</div>
{/each}

<Button
	on:click={() => {
		onPathsChange([...paths, ""]);
	}}>Add template</Button
>

<style>
	div {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 4px;
		padding-bottom: 4px;
		width: 100%;
	}

	div:first-child {
		flex: 1;
	}
</style>
