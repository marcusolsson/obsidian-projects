<script lang="ts">
  import type { DataFrame } from "src/lib/data";
  import type { ViewApi } from "src/lib/view-api";
  import type { ProjectDefinition, ViewDefinition } from "src/types";

  import { useView } from "./useView";

  /**
   * Specify the project.
   */
  export let project: ProjectDefinition;

  /**
   * Specify the view.
   */
  export let view: ViewDefinition;

  /**
   * Specify the data to display in the view.
   */
  export let frame: DataFrame;

  /**
   * Specify whether the view is read-only.
   */
  export let readonly: boolean;

  /**
   * Specify the API for updating the data.
   */
  export let api: ViewApi;

  /**
   * Specify a callback for updating the view configuration.
   */
  export let onConfigChange: (
    projectId: string,
    viewId: string,
    cfg: Record<string, any>
  ) => void;

  function handleConfigChange(config: Record<string, any>) {
    onConfigChange(project.id, view.id, config);
  }
</script>

<!--
	@component

	View dynamically selects the component to use based on a ViewDefinition.
-->
<div
  use:useView={{
    view,
    dataProps: {
      data: frame,
    },
    viewApi: api,
    project,
    readonly,
    config: view.config,
    onConfigChange: handleConfigChange,
  }}
/>

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>
