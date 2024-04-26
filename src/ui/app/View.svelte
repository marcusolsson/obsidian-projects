<script lang="ts">
  import type { DataFrame, DataRecord } from "src/lib/dataframe/dataframe";
  import { settings } from "src/lib/stores/settings";
  import type { ViewApi } from "src/lib/viewApi";
  import type {
    ProjectDefinition,
    ProjectId,
    SortDefinition,
    ViewDefinition,
    ViewId,
  } from "src/settings/settings";
  import { applyFilter, matchesCondition } from "./filterFunctions";

  import { useView } from "./useView";
  import { applySort, sortRecords } from "./viewSort";

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
    projectId: ProjectId,
    viewId: ViewId,
    cfg: Record<string, any>
  ) => void;

  function handleConfigChange(config: Record<string, any>) {
    onConfigChange(project.id, view.id, config);
  }

  // Clean up any filter conditions for non-existing fields.
  $: {
    const fieldNames = frame.fields.map((field) => field.name);

    if (
      viewFilter.conditions.length !==
      viewFilter.conditions.filter((cond) => fieldNames.includes(cond.field))
        .length
    ) {
      settings.updateView(project.id, {
        ...view,
        filter: {
          conjunction: viewFilter?.conjunction ?? "and",
          conditions: viewFilter.conditions.filter((cond) =>
            fieldNames.includes(cond.field)
          ),
        },
      });
    }
  }

  $: viewFilter = view.filter ?? { conjunction: "and", conditions: [] };
  $: filteredFrame = applyFilter(frame, viewFilter);

  $: viewSort =
    view.sort.criteria.length > 0
      ? view.sort
      : ({
          criteria: [{ field: "path", order: "asc", enabled: true }],
        } satisfies SortDefinition);

  $: sortedFrame = applySort(filteredFrame, viewSort);

  let recordCache: Record<string, DataRecord | undefined>;
  $: {
    frame;
    recordCache = {};
  }

  function getRecordColor(record: DataRecord): string | null {
    const colorFilter = view.colors ?? { conditions: [] };
    for (const cond of colorFilter.conditions) {
      if (cond.condition?.enabled ?? true) {
        if (matchesCondition(cond.condition, record)) {
          return cond.color;
        }
      }
    }
    return null;
  }

  const applyViewSortToRecords = (
    records: ReadonlyArray<DataRecord>
  ): Array<DataRecord> => {
    return sortRecords([...records], viewSort);
  };

  const getRecord = (id: string) => {
    return (
      recordCache[id] ??
      (recordCache[id] = frame.records.find((record) => record.id === id))
    );
  };
</script>

<!--
	@component

	View dynamically selects the component to use based on a ViewDefinition.
-->
<div
  use:useView={{
    view,
    dataProps: {
      data: sortedFrame,
      hasSort: view.sort.criteria.filter((c) => c.enabled).length > 0,
      hasFilter: view.filter.conditions.filter((c) => c.enabled).length > 0,
    },
    viewApi: api,
    project,
    readonly,
    config: view.config,
    onConfigChange: handleConfigChange,
    getRecordColor: getRecordColor,
    sortRecords: applyViewSortToRecords,
    getRecord,
  }}
/>

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>
