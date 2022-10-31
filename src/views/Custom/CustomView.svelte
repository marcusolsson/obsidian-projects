<script lang="ts">
  import type { ViewApi } from "src/lib/view-api";
  import type { DataFrame } from "../../lib/data";
  import { customViews } from "../../lib/stores/custom-views";

  export let type: string;
  export let api: ViewApi;
  export let config: Record<string, any>;
  export let onConfigChange: (config: Record<string, any>) => void;
  export let frame: DataFrame;

  $: ({ fields, records } = frame);

  $: createView = $customViews[type];
  $: viewV2 = createView?.();

  function useCustomView(node: HTMLElement, frame: DataFrame) {
    if (viewV2) {
      viewV2.contentEl = node;
      viewV2.viewApi = api;
      viewV2.saveConfig = onConfigChange;
      viewV2.onOpen?.(config);
      viewV2.onData?.(frame);
    }

    return {
      update(frame: DataFrame) {
        if (viewV2) {
          viewV2.onData?.(frame);
        }
      },
      destroy() {
        viewV2?.onClose();
      },
    };
  }
</script>

<div use:useCustomView={{ fields, records }} />

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>
