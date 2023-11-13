<script lang="ts">
  import {
    DataFieldType,
    type DataFrame,
    type DataRecord,
  } from "src/lib/dataframe/dataframe";
  import { createDataRecord } from "src/lib/dataApi";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import type { ViewApi } from "src/lib/viewApi";
  import { CreateNoteModal } from "src/ui/modals/createNoteModal";
  import { EditNoteModal } from "src/ui/modals/editNoteModal";

  import type {
    GridColDef,
    GridRowProps,
  } from "./components/DataGrid/dataGrid";
  import DataGrid from "./components/DataGrid/DataGrid.svelte";
  import SwitchSelect from "./components/SwitchSelect/SwitchSelect.svelte";
  import type { TableConfig } from "./types";

  import {
    ViewContent,
    ViewHeader,
    ViewLayout,
    ViewToolbar,
  } from "src/ui/components/Layout";
  import { ConfigureFieldModal } from "src/ui/modals/configureField";
  import { settings } from "src/lib/stores/settings";
  import { sortFields } from "./helpers";
  import type { ProjectDefinition } from "src/settings/settings";
  import { CreateFieldModal } from "src/ui/modals/createFieldModal";
  import { Icon } from "obsidian-svelte";
  import { TextLabel } from "./components/DataGrid/GridCell/GridTextCell";

  export let project: ProjectDefinition;
  export let frame: DataFrame;
  export let readonly: boolean;
  export let api: ViewApi;
  export let getRecordColor: (record: DataRecord) => string | null;

  export let config: TableConfig | undefined;
  export let onConfigChange: (cfg: TableConfig) => void;

  let buttonEl: HTMLElement;

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

  function handleColumnAdd() {
    new CreateFieldModal($app, fields, async (field, value) => {
      const orderFields = fields.map((field) => field.name);
      orderFields.filter((f) => f !== field.name);

      await api.addField(field, value);

      buttonEl.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "smooth",
      });

      orderFields.push(field.name);
      saveConfig({
        ...config,
        orderFields: orderFields,
      });

      if (field.typeConfig) {
        const projectFields = Object.fromEntries(
          Object.entries(project.fieldConfig ?? {}).filter(([key, _]) =>
            fields.find((field) => field.name === key)
          )
        );

        settings.updateProject({
          ...project,
          fieldConfig: {
            ...projectFields,
            [field.name]: field.typeConfig,
          },
        });
      }
    }).open();
  }

  function handleColumnInsert(anchor: string, direction: number) {
    new CreateFieldModal($app, fields, async (field, value) => {
      const orderFields = fields.map((field) => field.name);
      orderFields.filter((f) => f !== field.name);
      const position = fields.findIndex((f) => anchor === f.name) + direction;

      await api.addField(field, value, position);

      orderFields.splice(position, 0, field.name);

      saveConfig({
        ...config,
        orderFields: orderFields,
      });

      if (field.typeConfig) {
        const projectFields = Object.fromEntries(
          Object.entries(project.fieldConfig ?? {}).filter(([key, _]) =>
            fields.find((field) => field.name === key)
          )
        );

        settings.updateProject({
          ...project,
          fieldConfig: {
            ...projectFields,
            [field.name]: field.typeConfig,
          },
        });
      }
    }).open();
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
    <div>
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
              $i18n.t("modals.field.configure.title"),
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
        onColumnInsert={handleColumnInsert}
        onColumnDelete={(field) => api.deleteField(field)}
        onRowChange={(rowId, row) => {
          api.updateRecord({ id: rowId, values: row }, fields);
        }}
        onColumnResize={handleWidthChange}
        onColumnSort={(fields) => {
          saveConfig({
            ...config,
            orderFields: fields,
          });
        }}
      />
      <span
        tabindex="-1"
        bind:this={buttonEl}
        on:click={handleColumnAdd}
        on:keydown={(evt) => {
          if (evt.key === "Enter") handleColumnAdd();
        }}
      >
        <Icon name="plus" />
        <TextLabel value={$i18n.t("components.data-grid.column.add")} />
      </span>
    </div>
  </ViewContent>
</ViewLayout>

<style>
  div {
    display: flex;
  }

  /* styled as a column header*/
  span {
    position: sticky;
    top: 0;
    z-index: 6;

    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: center;

    background-color: var(--background-secondary);
    border-right: 1px solid var(--background-modifier-border);
    border-left-color: var(--background-modifier-border);
    border-bottom: 1px solid var(--background-modifier-border);

    height: fit-content;
    min-height: 30px;

    color: var(--text-muted);
    font-weight: 500;
    padding: 0 12px;

    cursor: default;
  }

  span:focus {
    border-radius: var(--button-radius);
    box-shadow: 0 0 0 2px var(--background-modifier-border-focus);
  }

  span:hover {
    color: var(--text-normal);
  }
</style>
