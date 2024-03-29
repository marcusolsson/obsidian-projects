<script lang="ts">
  import produce from "immer";
  import {
    ModalContent,
    ModalLayout,
    NumberInput,
    Select,
    SettingItem,
  } from "src/ui/mocks/obsidian-svelte";
  import { DataFieldType, type DataField } from "src/lib/dataframe/dataframe";
  import { i18n } from "src/lib/stores/i18n";
  import { fieldToSelectableValue } from "../../helpers";
  import { getFieldByName, getFieldsByType } from "../board";
  import type { BoardConfig } from "../types";

  export let config: BoardConfig;
  export let fields: DataField[];
  export let onSave: (config: BoardConfig) => void;

  let columnWidthValue = config.columnWidth ?? null;

  $: orderSyncField = config.orderSyncField ?? "";
  $: orderSyncDataField = orderSyncField
    ? getFieldByName(fields, orderSyncField)
    : undefined;
  $: validOrderSyncFields = getFieldsByType(fields, DataFieldType.Number);

  const updateConfig = <T extends keyof BoardConfig>(
    key: T,
    value: BoardConfig[T] | null
  ) =>
    onSave(
      produce(config, (draft) => {
        const { [key]: _, ...rest } = draft;
        return value ? { ...rest, [key]: value } : rest;
      })
    );
</script>

<ModalLayout title={$i18n.t("views.board.settings.name")}>
  <ModalContent>
    <SettingItem
      name={$i18n.t("views.board.settings.column-width.name")}
      description={$i18n.t("views.board.settings.column-width.description")}
    >
      <NumberInput
        placeholder="270"
        bind:value={columnWidthValue}
        on:blur={() => updateConfig("columnWidth", columnWidthValue)}
      />
    </SettingItem>
    <SettingItem
      name={$i18n.t("views.board.settings.order-sync-field.name")}
      description={$i18n.t("views.board.settings.order-sync-field.description")}
    >
      <Select
        value={orderSyncDataField?.name ?? ""}
        options={validOrderSyncFields.map(fieldToSelectableValue)}
        placeholder={$i18n.t("views.board.fields.none") ?? ""}
        allowEmpty
        on:change={(event) => {
          orderSyncField = event.detail;
          updateConfig("orderSyncField", orderSyncField);
        }}
      />
    </SettingItem>
  </ModalContent>
</ModalLayout>
