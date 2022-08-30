<script lang="ts">
	import { isLink, type DataValue, type Link } from "src/lib/datasource";

	import { GridCell } from "../";

	import LinkInput from "./LinkInput.svelte";
	import LinkLabel from "./LinkLabel.svelte";

	export let value: DataValue;
	export let width: number;

	export let onChange: (value: Link) => void;
</script>

{#if isLink(value)}
	<GridCell {width} on:mousedown>
		<LinkLabel slot="read" {value} />
		<LinkInput
			slot="edit"
			value={value.linkText}
			onChange={(linkText) => {
				if (isLink(value)) {
					onChange({
						...value,
						linkText,
					});
				}
			}}
		/>
	</GridCell>
{:else}
	<GridCell {width} on:mousedown>
		<LinkInput
			slot="edit"
			value=""
			onChange={(linkText) =>
				onChange({
					linkText,
					sourcePath: "",
				})}
		/>
	</GridCell>
{/if}
