<script lang="ts">
  import produce from "immer";
  import {
    SettingItem,
    NumberInput,
    ModalLayout,
    ModalContent,
  } from "obsidian-svelte";
  import type { GalleryConfig } from "../types";

  export let config: GalleryConfig;
  export let onSave: (config: GalleryConfig) => void;

  let cardWidthValue = config.cardWidth ?? null;
</script>

<ModalLayout title="Board settings">
  <ModalContent>
    <SettingItem name="Card width" description="Width of each card in pixels.">
      <NumberInput
        placeholder="270"
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
