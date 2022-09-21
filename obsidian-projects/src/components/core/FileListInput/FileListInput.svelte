<script lang="ts">
	import produce from "immer";
	import { Button, IconButton } from "obsidian-svelte";
	import { FileSuggestInput } from "../Suggest";

	export let paths: string[];
	export let onPathsChange: (value: string[]) => void;
</script>

<div>
	{#each paths as path, i}
		<span>
			<FileSuggestInput
				value={path}
				onChange={(value) => {
					onPathsChange(
						produce(paths, (draft) => {
							draft[i] = value;
							return draft;
						})
					);
				}}
				sourcePath=""
				include="files"
				valueType="path"
				fullWidth
			/>
			<IconButton
				icon="cross"
				on:click={() => {
					onPathsChange(paths.filter((_, j) => j !== i));
				}}
			/>
		</span>
	{/each}
	<Button
		on:click={() => {
			onPathsChange([...paths, ""]);
		}}>Add template</Button
	>
</div>

<style>
	div {
		padding-bottom: 0.75em;
	}
	span {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 4px;
		padding-bottom: 4px;
	}

	span:first-child {
		flex: 1;
	}
</style>
