<script lang="ts">
  import produce from "immer";
  import {
    SettingItem,
    NumberInput,
    ModalLayout,
    ModalContent,
  } from "obsidian-svelte";
  import type { BoardConfig } from "../types";
  import { i18n } from "src/lib/stores/i18n";

  export let config: BoardConfig;
  export let onSave: (config: BoardConfig) => void;

  let columnWidthValue = config.columnWidth ?? null;
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
        on:blur={() =>
          onSave(
            produce(config, (draft) => {
              const { columnWidth, ...rest } = draft;
              if (!columnWidthValue) {
                return rest;
              }
              return { ...rest, columnWidth: columnWidthValue };
            })
          )}
      />
    </SettingItem>
  </ModalContent>
</ModalLayout>
