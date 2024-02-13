<script lang="ts">
  import { createDataRecord } from "src/lib/dataApi";
  import type {
    DataField,
    DataFrame,
    DataRecord,
  } from "src/lib/dataframe/dataframe";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import type { ViewApi } from "src/lib/viewApi";
  import type { ProjectDefinition } from "src/settings/settings";
  import { CreateNoteModal } from "src/ui/modals/createNoteModal";
  import { EditNoteModal } from "src/ui/modals/editNoteModal";
  import { getRecordColorContext } from "src/ui/views/helpers";

  import BoardOptionsProvider from "./BoardOptionsProvider.svelte";
  import { getColumns } from "./board";
  import { Board } from "./components";
  import type { BoardConfig } from "./types";

  export let project: ProjectDefinition;
  export let frame: DataFrame;
  export let readonly: boolean;
  export let api: ViewApi;
  export let getRecordColor: (record: DataRecord) => string | null;

  export let config: BoardConfig | undefined;
  export let onConfigChange: (cfg: BoardConfig) => void;

  $: ({ fields, records } = frame);

  getRecordColorContext.set(getRecordColor);

  function handleRecordClick(record: DataRecord) {
    new EditNoteModal(
      $app,
      fields,
      (record) => api.updateRecord(record, fields),
      record
    ).open();
  }

  const handleRecordUpdate =
    (field: DataField | undefined) => (column: string, record: DataRecord) => {
      if (field) {
        api.updateRecord(
          copyRecordWithValues(record, {
            [field.name]: column,
          }),
          fields
        );
      }
    };

  const handleRecordAdd =
    (field: DataField | undefined) => (column: string) => {
      new CreateNoteModal($app, project, (name, templatePath) => {
        api.addRecord(
          createDataRecord(
            name,
            project,
            field
              ? {
                  [field.name]:
                    column !== $i18n.t("views.board.no-status")
                      ? column
                      : undefined,
                }
              : {}
          ),
          templatePath
        );
      }).open();
    };

  function handleSortColumns(names: string[]) {
    saveConfig({
      ...config,
      columns: Object.fromEntries(
        names.map((name, i) => {
          return [name, { weight: i }];
        })
      ),
    });
  }

  function saveConfig(cfg: BoardConfig) {
    config = cfg;
    onConfigChange(cfg);
  }
</script>

<!--
  @component

  BoardView is the main board component that gets mounted inside the project view.
-->
<BoardOptionsProvider
  {frame}
  config={config ?? {}}
  onConfigChange={saveConfig}
  let:columnWidth
  let:groupByField
  let:includeFields
>
  <Board
    columns={getColumns(records, config?.columns ?? {}, groupByField)}
    {columnWidth}
    includeFields={fields.filter((field) => includeFields.includes(field.name))}
    onRecordClick={handleRecordClick}
    onRecordAdd={handleRecordAdd(groupByField)}
    onRecordUpdate={handleRecordUpdate(groupByField)}
    onSortColumns={handleSortColumns}
    {readonly}
    richText={groupByField?.typeConfig?.richText ?? false}
  />
</BoardOptionsProvider>
