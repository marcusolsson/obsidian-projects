<script lang="ts">
	import { GridCell } from "..";
	import type { GridColDef } from "../../data-grid";
	import { TagList } from "../../../../../../core/TagList";

	export let value: string[] | undefined;
	export let onChange: (values: string[]) => void;
	export let column: GridColDef;
</script>

<GridCell {column} on:mousedown>
	<TagList slot="read" edit={false} values={value ?? []} />
	<TagList slot="edit" edit={true} values={value ?? []} {onChange} />
</GridCell>
