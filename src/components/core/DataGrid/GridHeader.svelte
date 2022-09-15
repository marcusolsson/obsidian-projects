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
	export let onFinalizeResize: (name: string, width: number) => void;
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
	<GridCell
		column={{ field: "", width: 60, header: true, editable: false }}
		columnHeader
		rowHeader
	/>
	{#each columns as column}
		<GridCell
			{column}
			resizable
			onResize={(width) => {
				onResize(column.field, width);
			}}
			onFinalizeResize={(width) => {
				onFinalizeResize(column.field, width);
			}}
			on:mousedown={handleColumnHeaderClick(column)}
			columnHeader
		>
			<svelte:fragment slot="read">
				<Icon name={fieldIcon(column.type ?? DataFieldType.Unknown)} />
				<TextLabel value={column.field} />
				<IconButton
					icon="vertical-three-dots"
					on:click={handleFieldClick(column)}
				/>
			</svelte:fragment>
		</GridCell>
	{/each}
</GridCellGroup>
