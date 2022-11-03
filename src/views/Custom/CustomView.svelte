<svelte:options immutable />

<script lang="ts">
  import type { DataQueryResult } from "src/custom-view-api";
  import { customViews } from "src/lib/stores/custom-views";
  import type { ViewApi } from "src/lib/view-api";
  import type { ProjectDefinition, ViewDefinition } from "src/types";
  import type { DataFrame } from "../../lib/data";

  export let view: ViewDefinition;
  export let api: ViewApi;
  export let config: Record<string, any>;
  export let onConfigChange: (config: Record<string, any>) => void;
  export let frame: DataFrame;
  export let project: ProjectDefinition;
  export let readonly: boolean;

  interface ViewProps {
    view: ViewDefinition;
    dataProps: DataQueryResult;
    config: Record<string, any>;
    onConfigChange: (config: Record<string, any>) => void;
    viewApi: ViewApi;
    readonly: boolean;
    project: ProjectDefinition;
  }

  function useView(node: HTMLElement, props: ViewProps) {
    // Keep track of previous view id to determine if view should be invalidated.
    let viewId = props.view.id;
    let projectId = props.project.id;

    let projectView = $customViews[props.view.type];

    if (projectView) {
      // Component just mounted, so treat all properties as dirty.
      projectView.onOpen({
        viewId: props.view.id,
        project: props.project,
        contentEl: node,
        config: props.config,
        saveConfig: props.onConfigChange,
        viewApi: props.viewApi,
        readonly: props.readonly,
      });
      projectView.onData(props.dataProps);
    }

    return {
      update(newprops: ViewProps) {
        // User switched to a different view.
        const dirty =
          newprops.view.id !== viewId || newprops.project.id !== projectId;

        if (dirty) {
          // Clean up previous view.
          projectView?.onClose();

          node.empty();

          // Look up the next view.
          projectView = $customViews[newprops.view.type];

          if (projectView) {
            projectView.onOpen({
              contentEl: node,
              viewId: newprops.view.id,
              project: newprops.project,
              viewApi: newprops.viewApi,
              readonly: newprops.readonly,
              config: newprops.config,
              saveConfig: newprops.onConfigChange,
            });
            projectView.onData(newprops.dataProps);
          }

          viewId = newprops.view.id;
        } else {
          projectView?.onData(newprops.dataProps);
        }
      },
      destroy() {
        projectView?.onClose();
      },
    };
  }
</script>

<div
  use:useView={{
    view,
    dataProps: {
      data: frame,
    },
    viewApi: api,
    project,
    readonly,
    config,
    onConfigChange,
  }}
/>

<style>
  div {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
</style>
