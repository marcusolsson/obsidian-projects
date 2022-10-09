<script lang="ts">
	import { get } from "svelte/store";
	import { Icon, IconButton } from "obsidian-svelte";
	import type { Menu } from "obsidian";

	import { GridCell, TextLabel } from "./GridCell";
	import { fieldIcon, menuOnContextMenu, type GridColDef } from "./data-grid";

	import GridCellGroup from "./GridCellGroup.svelte";

	import { DataFieldType } from "obsidian-projects/src/lib/data";
	import { i18n } from "obsidian-projects/src/lib/stores/i18n";

	export let columns: GridColDef[];
	export let onResize: (name: string, width: number) => void;
	export let onFinalizeResize: (name: string, width: number) => void;
	export let onColumnMenu: (column: GridColDef) => Menu;

	function handleColumnHeaderClick(
		column: GridColDef
	): (event: MouseEvent) => void {
		return (event: MouseEvent) => {
			if (event.button === 2) {
				menuOnContextMenu(event, onColumnMenu(column));
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
				<Icon
					name={fieldIcon(column.type ?? DataFieldType.Unknown)}
					tooltip={get(i18n).t(`data-types.${column.type}`) ?? ""}
				/>
				<TextLabel value={column.field} />
				<IconButton
					size="sm"
					icon="vertical-three-dots"
					on:click={handleFieldClick(column)}
				/>
			</svelte:fragment>
		</GridCell>
	{/each}
</GridCellGroup>
