<script lang="ts">
  import { Icon, IconButton, Select } from "obsidian-svelte";

  import { Field } from "src/components/Field";
  import {
    ViewContent,
    ViewHeader,
    ViewLayout,
    ViewToolbar,
  } from "src/components/Layout";
  import { DataFieldType, type DataFrame, type DataRecord } from "src/lib/data";
  import { createDataRecord } from "src/lib/data-api";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import type { ViewApi } from "src/lib/view-api";
  import { CreateNoteModal } from "src/modals/create-note-modal";
  import { EditNoteModal } from "src/modals/edit-note-modal";
  import type { ProjectDefinition } from "src/types";
  import { fieldToSelectableValue } from "src/views/helpers";

  import { groupRecordsByField } from "./board";
  import { Board } from "./components";
  import { BoardSettingsModal } from "./settings/settings-modal";
  import type { BoardConfig } from "./types";

  export let project: ProjectDefinition;
  export let frame: DataFrame;
  export let readonly: boolean;
  export let api: ViewApi;

  export let config: BoardConfig | undefined;
  export let onConfigChange: (cfg: BoardConfig) => void;

  $: ({ fields, records } = frame);

  $: textFields = fields
    .filter((field) => !field.repeated)
    .filter(
      (field) =>
        field.type === DataFieldType.String ||
        field.type === DataFieldType.Number
    );

  $: groupByField = fields.find((field) => config?.groupByField === field.name);

  $: priorityFields = fields
    .filter((field) => !field.repeated)
    .filter(
      (field) =>
        field.type === DataFieldType.Number || field.type === DataFieldType.Date
    );

  $: priorityField = fields.find(
    (field) => config?.priorityField === field.name
  );

  $: groupedRecords = groupRecordsByField(records, groupByField?.name);

  $: columns = Object.entries(groupedRecords).map((entry) => entry[0]);

  function handleRecordClick(record: DataRecord) {
    new EditNoteModal(
      $app,
      fields,
      (record) => api.updateRecord(record, fields),
      record
    ).open();
  }

  function handleRecordUpdate(column: string, record: DataRecord) {
    if (groupByField) {
      api.updateRecord(
        {
          ...record,
          values: { ...record.values, [groupByField.name]: column },
        },
        fields
      );
    }
  }

  function handleRecordAdd(column: string) {
    new CreateNoteModal($app, project, (name, templatePath) => {
      if (groupByField) {
        api.addRecord(
          createDataRecord(
            name,
            project,
            groupByField
              ? {
                  [groupByField.name]:
                    column !== $i18n.t("views.board.no-status")
                      ? column
                      : undefined,
                }
              : {}
          ),
          templatePath
        );
      }
    }).open();
  }
</script>

<ViewLayout>
  <ViewHeader>
    <ViewToolbar variant="secondary">
      <svelte:fragment slot="right">
        <Field name={$i18n.t("views.board.fields.status")}>
          <Select
            value={groupByField?.name ?? ""}
            options={textFields.map(fieldToSelectableValue)}
            on:change={({ detail: value }) =>
              onConfigChange({
                ...config,
                groupByField: value,
              })}
            placeholder={$i18n.t("views.board.fields.none") ?? ""}
            allowEmpty
          />
        </Field>
        <Field name={$i18n.t("views.board.fields.priority")}>
          <Select
            value={priorityField?.name ?? ""}
            options={priorityFields.map(fieldToSelectableValue)}
            on:change={({ detail: value }) => {
              onConfigChange({
                ...config,
                priorityField: value,
              });
            }}
            placeholder={$i18n.t("views.board.fields.none") ?? ""}
            allowEmpty
          />
        </Field>
        {#if priorityField?.type === DataFieldType.Date}
          <Icon
            name="info"
            tooltip="Date fields can't be reprioritized using drag and drop."
          />
        {/if}
        <IconButton
          icon="settings"
          on:click={() => {
            new BoardSettingsModal($app, config ?? {}, (value) => {
              config = value;
              onConfigChange(value);
            }).open();
          }}
        />
      </svelte:fragment>
    </ViewToolbar>
  </ViewHeader>
  <ViewContent>
    <div>
      <Board
        onRecordUpdate={handleRecordUpdate}
        dragDisabled={priorityField?.type !== DataFieldType.Number}
        onSortColumns={(names) => {
          onConfigChange({
            ...config,
            columns: Object.fromEntries(
              names.map((name, i) => {
                return [name, { weight: i }];
              })
            ),
          });
        }}
        {readonly}
        columns={columns
          .sort((a, b) => {
            const aweight = config?.columns?.[a]?.weight ?? 0;
            const bweight = config?.columns?.[b]?.weight ?? 0;

            if (aweight < bweight) {
              return -1;
            } else if (aweight > bweight) {
              return 1;
            } else {
              return 0;
            }
          })
          .map((column) => ({
            id: column,
            records: groupedRecords[column] ?? [],
          }))}
        groupByPriority={priorityField?.name}
        onRecordClick={handleRecordClick}
        onRecordAdd={handleRecordAdd}
        columnWidth={config?.columnWidth ?? 270}
      />
    </div>
  </ViewContent>
</ViewLayout>

<style>
  div {
    background-color: var(--background-primary);
    padding: 8px;
  }
</style>
