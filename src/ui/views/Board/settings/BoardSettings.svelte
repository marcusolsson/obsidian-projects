<script lang="ts">
  import produce from "immer";
  import {
    ModalContent,
    ModalLayout,
    NumberInput,
    Select,
    SettingItem,
  } from "obsidian-svelte";
  import { DataFieldType, type DataField } from "src/lib/dataframe/dataframe";
  import { i18n } from "src/lib/stores/i18n";
  import { fieldToSelectableValue } from "../../helpers";
  import { getFieldsByType } from "../board";
  import type { BoardConfig } from "../types";

  export let config: BoardConfig;
  export let fields: DataField[];
  export let onSave: (config: BoardConfig) => void;

  let columnWidthValue = config.columnWidth ?? null;

  $: headerField = config.headerField ?? "";
  $: orderSyncField = config.orderSyncField ?? "";
  $: pointsField = config.pointsField ?? "";

  $: numberFields = getFieldsByType(fields, DataFieldType.Number);

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
      name={$i18n.t("views.board.settings.custom-header.name")}
      description={$i18n.t("views.board.settings.custom-header.description")}
    >
      <Select
        value={headerField ?? ""}
        options={fields.map(fieldToSelectableValue)}
        placeholder={$i18n.t("views.board.fields.none") ?? ""}
        allowEmpty
        on:change={(event) => {
          headerField = event.detail;
          updateConfig("headerField", headerField);
        }}
      />
    </SettingItem>
    <SettingItem
      name={$i18n.t("views.board.settings.order-sync-field.name")}
      description={$i18n.t("views.board.settings.order-sync-field.description")}
    >
      <Select
        value={orderSyncField ?? ""}
        options={numberFields.map(fieldToSelectableValue)}
        placeholder={$i18n.t("views.board.fields.none") ?? ""}
        allowEmpty
        on:change={(event) => {
          orderSyncField = event.detail;
          updateConfig("orderSyncField", orderSyncField);
        }}
      />
    </SettingItem>
    <SettingItem
      name={$i18n.t("views.board.settings.points-field.name")}
      description={$i18n.t("views.board.settings.points-field.description")}
    >
      <Select
        value={pointsField ?? ""}
        options={numberFields.map(fieldToSelectableValue)}
        placeholder={$i18n.t("views.board.fields.none") ?? ""}
        allowEmpty
        on:change={(event) => {
          pointsField = event.detail;
          updateConfig("pointsField", pointsField);
        }}
      />
    </SettingItem>
  </ModalContent>
</ModalLayout>
