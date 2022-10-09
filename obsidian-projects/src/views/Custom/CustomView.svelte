<script lang="ts">
	import { Builder, type ProjectView } from "../../builder";
	import type { DataFrame } from "../../lib/types";
	import { customViews, customViewsV2 } from "../../lib/stores/custom-views";

	export let type: string;
	export let frame: DataFrame;

	$: ({ fields, records } = frame);

	$: createView = $customViewsV2[type];
	$: viewV2 = createView?.();

	let view = new Builder();

	$: viewBuilder = $customViews[type] ?? ((view: ProjectView) => {});
	$: {
		view = new Builder();
		viewBuilder(view);
	}

	function useCustomView(node: HTMLElement, frame: DataFrame) {
		if (viewV2) {
			viewV2.containerEl = node;
			viewV2.onOpen?.();
			viewV2.onData?.(frame);
		} else {
			view.onOpen?.(frame, node);
		}

		return {
			update(frame: DataFrame) {
				if (viewV2) {
					viewV2.onData?.(frame);
				} else {
					node.empty();
					view.onOpen?.(frame, node);
				}
			},
			destroy() {
				viewV2?.onClose();
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
