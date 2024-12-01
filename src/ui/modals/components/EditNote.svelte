<script lang="ts">
  import { produce } from "immer";
  import {
    Button,
    Callout,
    ModalButtonGroup,
    ModalContent,
    ModalLayout,
    SettingItem,
    Typography,
  } from "obsidian-svelte";

  import { FieldControl } from "src/ui/components/FieldControl";
  import type { DataField, DataRecord } from "src/lib/dataframe/dataframe";
  import { i18n } from "src/lib/stores/i18n";

  export let fields: DataField[];
  export let record: DataRecord;

  $: editableFields = fields.filter((field) => !field.derived);

  export let onSave: (record: DataRecord) => void;
</script>

<ModalLayout title={$i18n.t("modals.note.edit.title")}>
  {#if !editableFields.length}
    <Callout
      title={$i18n.t("modals.note.edit.no-editable-fields.title")}
      icon="info"
      variant="info"
    >
      <Typography variant="body">
        {$i18n.t("modals.note.edit.no-editable-fields.message")}
      </Typography>
    </Callout>
    <ModalContent>
      {#each fields as field (field.name)}
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
            readonly={true}
          />
        </SettingItem>
      {/each}
    </ModalContent>
  {/if}
  <ModalContent>
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
      }}
      >{editableFields.length
        ? $i18n.t("modals.note.edit.save")
        : $i18n.t("modals.note.edit.confirm")}</Button
    >
  </ModalButtonGroup>
</ModalLayout>
