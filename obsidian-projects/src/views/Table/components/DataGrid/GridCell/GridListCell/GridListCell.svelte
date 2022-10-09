<script lang="ts">
	import { TagList } from "obsidian-projects/src/components/TagList";
	import { GridCell } from "..";
	import type { GridColDef } from "../../data-grid";

	export let value: string[] | undefined;
	export let onChange: (values: string[]) => void;
	export let column: GridColDef;
</script>

<GridCell {column} on:mousedown>
	<TagList slot="read" edit={false} values={value ?? []} />
	<TagList slot="edit" edit={true} values={value ?? []} {onChange} />
</GridCell>
