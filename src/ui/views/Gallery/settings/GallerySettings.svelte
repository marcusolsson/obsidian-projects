<script lang="ts">
  import { produce } from "immer";
  import {
    SettingItem,
    NumberInput,
    ModalLayout,
    ModalContent,
  } from "obsidian-svelte";
  import type { GalleryConfig } from "../types";
  import { i18n } from "src/lib/stores/i18n";

  export let config: GalleryConfig;
  export let onSave: (config: GalleryConfig) => void;

  let cardWidthValue = config.cardWidth ?? null;
</script>

<ModalLayout title={$i18n.t("views.gallery.settings.name")}>
  <ModalContent>
    <SettingItem
      name={$i18n.t("views.gallery.settings.card-width.name")}
      description={$i18n.t("views.gallery.settings.card-width.description")}
    >
      <NumberInput
        placeholder="300"
        bind:value={cardWidthValue}
        on:blur={() =>
          onSave(
            produce(config, (draft) => {
              const { cardWidth, ...rest } = draft;
              if (!cardWidthValue) {
                return rest;
              }
              return { ...rest, cardWidth: cardWidthValue };
            })
          )}
      />
    </SettingItem>
  </ModalContent>
</ModalLayout>
