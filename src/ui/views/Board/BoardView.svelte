<script lang="ts">
  import { createDataRecord } from "src/lib/dataApi";
  import type {
    DataField,
    DataFrame,
    DataRecord,
  } from "src/lib/dataframe/dataframe";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import { settings } from "src/lib/stores/settings";
  import type { ViewApi } from "src/lib/viewApi";
  import type { ProjectDefinition } from "src/settings/settings";
  import { CreateNoteModal } from "src/ui/modals/createNoteModal";
  import { EditNoteModal } from "src/ui/modals/editNoteModal";
  import { setRecordColorContext } from "src/ui/views/helpers";

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

  setRecordColorContext(getRecordColor);

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
          {
            ...record,
            values: { ...record.values, [field.name]: column },
          },
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

  // catch rename error of yaml parser!
  const handleColumnRename = (
    field: DataField | undefined,
    names: string[], // all column names, detected & defined
    records: DataRecord[], // notes that belong to the column
    oldname: string, // old column id
    newname: string // proposing column id
  ) => {
    if (!field) return;
    if (oldname === newname) return;

    records.forEach((record) => {
      api.updateRecord(
        {
          ...record,
          values: { ...record.values, [field.name]: newname },
        },
        fields
      );
    });

    const projectFields = Object.fromEntries(
      Object.entries(project.fieldConfig ?? {}).filter(([key, _]) =>
        fields.find((f) => f.name === key)
      )
    );

    if (field.typeConfig && field.typeConfig.options) {
      const options = field.typeConfig.options.map((option) =>
        option === oldname ? newname : option
      );

      settings.updateProject({
        ...project,
        fieldConfig: {
          ...projectFields,
          [field.name]: {
            ...field.typeConfig,
            options: options,
          },
        },
      });
    }

    const columns = names.map((name) => (name === oldname ? newname : name));
    saveConfig({
      ...config,
      columns: Object.fromEntries(
        columns.map((name, i) => {
          return [name, { weight: i }];
        })
      ),
    });
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

  function handleColumnAdd(
    field: DataField | undefined,
    columns: string[], // all column names, detected & predefined
    name: string
  ) {
    if (!field) return;

    const projectFields = Object.fromEntries(
      Object.entries(project.fieldConfig ?? {}).filter(([key, _]) =>
        fields.find((f) => f.name === key)
      )
    );

    if (field.typeConfig && field.typeConfig.options) {
      settings.updateProject({
        ...project,
        fieldConfig: {
          ...projectFields,
          [field.name]: {
            ...field.typeConfig,
            options: [...field.typeConfig.options, name],
          },
        },
      });
    } else {
      settings.updateProject({
        ...project,
        fieldConfig: {
          ...projectFields,
          [field.name]: {
            ...field.typeConfig,
            options: [name],
          },
        },
      });
    }

    saveConfig({
      ...config,
      columns: Object.fromEntries(
        [...columns, name].map((column, i) => {
          return [column, { weight: i }];
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
    onColumnAdd={(columns, name) =>
      handleColumnAdd(groupByField, columns, name)}
    onColumnRename={(columns, records, oldname, newname) =>
      handleColumnRename(groupByField, columns, records, oldname, newname)}
    {readonly}
    richText={groupByField?.typeConfig?.richText ?? false}
  />
</BoardOptionsProvider>
