<svelte:options immutable />

<script lang="ts">
  import type { ProjectViewV2 } from "src/custom-view-api";
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
    api: ViewApi;
    config: Record<string, any>;
    onConfigChange: (config: Record<string, any>) => void;
    frame: DataFrame;
    project: ProjectDefinition;
    readonly: boolean;
  }

  let projectView: ProjectViewV2 | undefined;

  function updateView(node: HTMLElement, props: ViewProps) {
    if (projectView) {
      projectView.contentEl = node;
      projectView.project = props.project;
      projectView.readonly = props.readonly;
      projectView.viewApi = props.api;
      projectView.saveConfig = props.onConfigChange;
      projectView.onData(props.frame);
    }
  }

  function useView(node: HTMLElement, props: ViewProps) {
    let viewId = props.view.id;

    projectView = $customViews[props.view.type]?.();

    updateView(node, props);

    if (projectView) {
      projectView.onOpen(props.config);
    }

    return {
      update(newprops: ViewProps) {
        if (newprops.view.id !== viewId) {
          if (projectView) {
            projectView.onClose();
            projectView = $customViews[newprops.view.type]?.();
          }
        }

        updateView(node, newprops);

        if (newprops.view.id !== viewId) {
          if (projectView) {
            projectView.onOpen(newprops.config);
          }
        }

        viewId = newprops.view.id;
      },
      destroy() {
        if (projectView) {
          projectView.onClose();
        }
      },
    };
  }
</script>

<div
  use:useView={{ view, frame, config, onConfigChange, api, project, readonly }}
/>

<style>
  div {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
</style>
