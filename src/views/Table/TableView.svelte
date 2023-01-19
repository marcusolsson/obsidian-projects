<script lang="ts">
  import { DataFieldType, type DataFrame, type DataRecord } from "src/lib/data";
  import { createDataRecord } from "src/lib/data-api";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import type { ViewApi } from "src/lib/view-api";
  import { CreateNoteModal } from "src/modals/create-note-modal";
  import { EditNoteModal } from "src/modals/edit-note-modal";

  import type {
    GridColDef,
    GridRowProps,
  } from "./components/DataGrid/data-grid";
  import DataGrid from "./components/DataGrid/DataGrid.svelte";
  import SwitchSelect from "./components/SwitchSelect/SwitchSelect.svelte";
  import type { TableConfig } from "./types";

  import {
    ViewContent,
    ViewHeader,
    ViewLayout,
    ViewToolbar,
  } from "src/components/Layout";
  import { ConfigureFieldModal } from "src/modals/configure-field";
  import { settings } from "src/lib/stores/settings";
  import { sortFields } from "./helpers";
  import type { ProjectDefinition } from "src/settings/settings";

  export let project: ProjectDefinition;
  export let frame: DataFrame;
  export let readonly: boolean;
  export let api: ViewApi;
  export let getRecordColor: (record: DataRecord) => string | null;

  export let config: TableConfig | undefined;
  export let onConfigChange: (cfg: TableConfig) => void;

  function saveConfig(cfg: TableConfig) {
    config = cfg;
    onConfigChange(cfg);
  }

  $: ({ fields, records } = frame);

  $: {
    fields = sortFields(fields, config?.orderFields ?? []);
  }

  $: fieldConfig = config?.fieldConfig ?? {};

  $: columns = fields
    .filter((field) => {
      // Table only supports repeated fields of type string.
      if (field.repeated) {
        return field.type === DataFieldType.String;
      }
      return true;
    })
    .map<GridColDef>((field) => {
      const colDef: GridColDef = {
        ...field,
        field: field.name,
        width: fieldConfig[field.name]?.width ?? 180,
        hide: fieldConfig[field.name]?.hide ?? false,
        editable: !field.derived,
      };

      return colDef;
    });

  $: rows = records.map<GridRowProps>(({ id, values }) => ({
    rowId: id,
    row: values,
  }));

  function handleVisibilityChange(field: string, enabled: boolean) {
    saveConfig({
      ...config,
      fieldConfig: {
        ...fieldConfig,
        [field]: {
          ...fieldConfig[field],
          hide: !enabled,
        },
      },
    });
  }

  function handleWidthChange(field: string, width: number) {
    saveConfig({
      ...config,
      fieldConfig: {
        ...fieldConfig,
        [field]: {
          ...fieldConfig[field],
          width,
        },
      },
    });
  }
</script>

<ViewLayout>
  <ViewHeader>
    <ViewToolbar variant="secondary">
      <svelte:fragment slot="right">
        <SwitchSelect
          label={$i18n.t("views.table.hide-fields")}
          items={columns.map((column) => ({
            label: column.field,
            value: column.field,
            enabled: !column.hide,
          }))}
          onChange={handleVisibilityChange}
        />
      </svelte:fragment>
    </ViewToolbar>
  </ViewHeader>
  <ViewContent>
    <DataGrid
      {columns}
      {rows}
      {readonly}
      colorModel={(rowId) => {
        const record = frame.records.find((record) => record.id === rowId);
        if (record) {
          return getRecordColor(record);
        }
        return null;
      }}
      onRowAdd={() => {
        new CreateNoteModal($app, project, (name, templatePath, project) => {
          api.addRecord(createDataRecord(name, project), templatePath);
        }).open();
      }}
      onRowEdit={(id, values) => {
        new EditNoteModal(
          $app,
          fields,
          (record) => {
            api.updateRecord(record, fields);
          },
          {
            id,
            values,
          }
        ).open();
      }}
      onRowDelete={(id) => api.deleteRecord(id)}
      onColumnHide={(column) => handleVisibilityChange(column.field, false)}
      onColumnConfigure={(column, editable) => {
        const field = fields.find((field) => field.name === column.field);

        if (field) {
          new ConfigureFieldModal(
            $app,
            "Configure field",
            field,
            editable,
            (field) => {
              if (editable) {
                if (field.name !== column.field) {
                  api.updateField(field, column.field);
                } else {
                  api.updateField(field);
                }
              }

              const projectFields = Object.fromEntries(
                Object.entries(project.fieldConfig ?? {}).filter(([key, _]) =>
                  fields.find((field) => field.name === key)
                )
              );

              if (field.typeConfig) {
                settings.updateProject({
                  ...project,
                  fieldConfig: {
                    ...projectFields,
                    [field.name]: field.typeConfig,
                  },
                });
              }
            }
          ).open();
        }
      }}
      onColumnDelete={(field) => api.deleteField(field)}
      onRowChange={(rowId, row) => {
        api.updateRecord({ id: rowId, values: row }, fields);
      }}
      onColumnResize={handleWidthChange}
      sortModel={{
        field: config?.sortField ?? "name",
        sort: config?.sortAsc ? "asc" : "desc",
      }}
      onSortModelChange={(field, sort) => {
        saveConfig({
          ...config,
          sortField: field,
          sortAsc: sort === "asc",
        });
      }}
    />
  </ViewContent>
</ViewLayout>
