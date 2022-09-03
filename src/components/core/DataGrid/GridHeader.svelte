<script lang="ts">
	import type { Menu } from "obsidian";

	import { Icon } from "../../core/Icon";
	import { IconButton } from "../../core/IconButton";

	import { GridCell, TextLabel } from "./GridCell";
	import { fieldIcon, type GridColDef } from "./data-grid";

	import GridCellGroup from "./GridCellGroup.svelte";
	import { DataFieldType } from "src/lib/data";

	export let columns: GridColDef[];
	export let onResize: (name: string, width: number) => void;
	export let onColumnMenu: (column: GridColDef) => Menu;

	function handleColumnHeaderClick(
		column: GridColDef
	): (event: MouseEvent) => void {
		return (event: MouseEvent) => {
			if (event.button === 2) {
				onColumnMenu(column).showAtMouseEvent(event);
			}
		};
	}

	function handleFieldClick(column: GridColDef): (event: MouseEvent) => void {
		return (event: MouseEvent) => {
			onColumnMenu(column).showAtMouseEvent(event);
		};
	}
</script>

<GridCellGroup header>
	<GridCell header width={60} />
	{#each columns as column}
		<GridCell
			header
			resizable
			width={column.width ?? 180}
			onResize={(width) => {
				onResize(column.field, width);
			}}
			on:mousedown={handleColumnHeaderClick(column)}
		>
			<div slot="read">
				<Icon name={fieldIcon(column.type ?? DataFieldType.Unknown)} />
				<TextLabel slot="read" value={column.field} />
				<IconButton
					icon="vertical-three-dots"
					on:click={handleFieldClick(column)}
				/>
			</div>
		</GridCell>
	{/each}
</GridCellGroup>

<style>
	div {
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 0 4px;
		width: 100%;
	}
</style>
