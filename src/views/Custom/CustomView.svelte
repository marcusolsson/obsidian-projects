<script lang="ts">
  import type { ViewApi } from "src/lib/view-api";
  import type { DataFrame } from "../../lib/data";
  import { customViews } from "../../lib/stores/custom-views";

  export let type: string;
  export let api: ViewApi;
  export let config: Record<string, any>;
  export let onConfigChange: (config: Record<string, any>) => void;
  export let frame: DataFrame;

  $: view = $customViews[type]?.();

  function useCustomView(
    node: HTMLElement,
    { api, frame }: { api: ViewApi; frame: DataFrame }
  ) {
    if (view) {
      view.contentEl = node;
      view.viewApi = api;
      view.saveConfig = onConfigChange;
      view.onOpen(config);
      view.onData(frame);
    }

    return {
      update({ api, frame }: { api: ViewApi; frame: DataFrame }) {
        if (view) {
          view.viewApi = api;
          view.onData(frame);
        }
      },
      destroy() {
        if (view) {
          view.onClose();
        }
      },
    };
  }
</script>

<div use:useCustomView={{ api, frame }} />

<style>
  div {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
</style>
