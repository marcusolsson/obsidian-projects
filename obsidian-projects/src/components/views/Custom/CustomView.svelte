<script lang="ts">
	import { Builder, type ProjectView } from "../../../builder";
	import type { DataField, DataFrame, DataRecord } from "../../../lib/types";
	import { customViews } from "../../../lib/stores/custom-views";

	export let type: string;
	export let records: DataRecord[];
	export let fields: DataField[];

	let view = new Builder();

	$: viewBuilder = $customViews[type] ?? ((view: ProjectView) => {});
	$: {
		view = new Builder();
		viewBuilder(view);
	}

	function useCustomView(node: HTMLElement, frame: DataFrame) {
		view.onOpen?.(frame, node);

		return {
			update(frame: DataFrame) {
				node.empty();
				view.onOpen?.(frame, node);
			},
		};
	}
</script>

<div class:noPadding={view.noPadding} use:useCustomView={{ fields, records }} />

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
