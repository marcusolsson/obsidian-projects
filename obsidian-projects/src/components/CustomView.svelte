<script lang="ts">
	import { Builder } from "../builder";
	import type { DataField, DataFrame, DataRecord } from "../lib/types";
	import { customViews } from "../lib/stores/custom-views";

	export let type: string;
	export let records: DataRecord[];
	export let fields: DataField[];

	$: viewBuilder = $customViews[type] ?? (() => new Builder());
	$: value = viewBuilder();

	function useCustomView(node: HTMLElement, frame: DataFrame) {
		value.onOpen?.(frame, node);

		return {
			update(frame: DataFrame) {
				node.empty();
				value.onOpen?.(frame, node);
			},
		};
	}
</script>

<div
	class:noPadding={value.noPadding}
	use:useCustomView={{ fields, records }}
/>

<style>
	div {
		width: 100%;
		height: 100%;
		padding: var(--size-4-3);
	}

	.noPadding {
		padding: 0;
	}
</style>
