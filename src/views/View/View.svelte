<script lang="ts">
  import type { ProjectDefinition, ViewDefinition } from "../../types";

  import type { DataFrame } from "../../lib/data";
  import type { ViewApi } from "../../lib/view-api";
  import { CustomView } from "../Custom";

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
<CustomView
  {frame}
  {project}
  {view}
  config={view.config}
  {readonly}
  {api}
  onConfigChange={handleConfigChange}
/>
