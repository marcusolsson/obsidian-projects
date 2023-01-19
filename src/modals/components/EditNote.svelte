<script lang="ts">
  import produce from "immer";
  import {
    Button,
    Callout,
    ModalButtonGroup,
    ModalContent,
    ModalLayout,
    SettingItem,
  } from "obsidian-svelte";

  import { FieldControl } from "src/components/FieldControl";
  import type { DataField, DataRecord } from "src/lib/data";
  import { i18n } from "src/lib/stores/i18n";

  export let fields: DataField[];
  export let record: DataRecord;

  $: editableFields = fields.filter((field) => !field.derived);

  export let onSave: (record: DataRecord) => void;
</script>

<ModalLayout title={$i18n.t("modals.note.edit.title")}>
  <ModalContent>
    {#if !editableFields.length}
      <Callout
        title={$i18n.t("modals.note.edit.no-editable-fields.title")}
        icon="info"
        variant="info"
      >
        {$i18n.t("modals.note.edit.no-editable-fields.message")}
      </Callout>
    {/if}
    {#each editableFields as field (field.name)}
      <SettingItem name={field.name}>
        <FieldControl
          {field}
          value={record.values[field.name]}
          onChange={(value) => {
            record = produce(record, (draft) => {
              // @ts-ignore
              draft.values[field.name] = value;
            });
          }}
        />
      </SettingItem>
    {/each}
  </ModalContent>
  <ModalButtonGroup>
    <Button
      variant="primary"
      on:click={() => {
        onSave(record);
      }}>{$i18n.t("modals.note.edit.save")}</Button
    >
  </ModalButtonGroup>
</ModalLayout>
