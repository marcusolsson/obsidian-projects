<script lang="ts">
	import { Builder } from "../../builder";
	import type { DataFrame } from "../../lib/data";
	import { customViews, customViewsV2 } from "../../lib/stores/custom-views";

	export let type: string;
	export let frame: DataFrame;

	$: ({ fields, records } = frame);

	$: createView = $customViewsV2[type];
	$: viewV2 = createView?.();

	let builder = new Builder();

	$: viewBuilder = $customViews[type] ?? (() => {});
	$: {
		builder = new Builder();
		viewBuilder(builder);
	}

	function useCustomView(node: HTMLElement, frame: DataFrame) {
		if (viewV2) {
			viewV2.containerEl = node;
			viewV2.onOpen?.();
			viewV2.onData?.(frame);
		} else {
			builder.onOpen?.(frame, node);
		}

		return {
			update(frame: DataFrame) {
				if (viewV2) {
					viewV2.onData?.(frame);
				} else {
					node.empty();
					builder.onOpen?.(frame, node);
				}
			},
			destroy() {
				viewV2?.onClose();
			},
		};
	}
</script>

<div
	class:noPadding={builder.noPadding}
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
