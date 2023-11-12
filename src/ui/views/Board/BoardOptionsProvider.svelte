<script lang="ts">
  import {
    ViewContent,
    ViewHeader,
    ViewLayout,
    ViewToolbar,
  } from "src/ui/components/Layout";
  import type { BoardConfig } from "./types";
  import BoardOptions from "./BoardOptions.svelte";
  import type { DataField, DataFrame } from "src/lib/dataframe/dataframe";
  import { BoardSettingsModal } from "./settings/settingsModal";
  import { app } from "src/lib/stores/obsidian";

  export let config: BoardConfig;
  export let onConfigChange: (cfg: BoardConfig) => void;

  export let frame: DataFrame;

  $: ({ fields } = frame);

  $: columnWidth = config?.columnWidth ?? 270;

  function handleIncludedFieldsChange(fields: string[]) {
    onConfigChange({ ...config, includeFields: fields });
  }

  function handleStatusFieldChange(field: DataField | undefined) {
    const { groupByField, ...rest } = config;

    onConfigChange(field ? { ...rest, groupByField: field.name } : { ...rest });
  }
</script>

<!--
    @component

    BoardOptionsProvider abstracts away the scaffolding around the view, such as
    the toolbar and options.
-->
<ViewLayout>
  <ViewHeader>
    <ViewToolbar variant="secondary">
      <BoardOptions
        slot="right"
        {fields}
        statusField={config.groupByField}
        onStatusFieldChange={handleStatusFieldChange}
        includedFields={config.includeFields ?? []}
        onIncludedFieldsChange={handleIncludedFieldsChange}
        onSettings={() => {
          new BoardSettingsModal($app, config, (value) => {
            onConfigChange(value);
          }).open();
        }}
      />
    </ViewToolbar>
  </ViewHeader>
  <ViewContent>
    <slot
      {columnWidth}
      groupByField={fields.find((field) => config.groupByField === field.name)}
      includeFields={config.includeFields ?? []}
    />
  </ViewContent>
</ViewLayout>
