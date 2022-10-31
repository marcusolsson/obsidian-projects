<script lang="ts">
  import type { ViewApi } from "src/lib/view-api";
  import { Builder } from "../../builder";
  import type { DataFrame } from "../../lib/data";
  import { customViews, customViewsV2 } from "../../lib/stores/custom-views";

  export let type: string;
  export let api: ViewApi;
  export let config: Record<string, any>;
  export let onConfigChange: (config: Record<string, any>) => void;
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
      viewV2.contentEl = node;
      viewV2.viewApi = api;
      viewV2.saveConfig = (config) => {
        onConfigChange(config);
      };
      viewV2.onOpen?.(config);
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

<div use:useCustomView={{ fields, records }} />

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>
