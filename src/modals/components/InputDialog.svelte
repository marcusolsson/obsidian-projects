<script lang="ts">
  import {
    Button,
    ModalButtonGroup,
    ModalContent,
    ModalLayout,
  } from "obsidian-svelte";

  import { i18n } from "src/lib/stores/i18n";

  export let value: string;
  export let message: string;
  export let cta: string;
  export let onSubmit: (value: string) => void;
  export let onCancel: () => void;

  let ref: HTMLInputElement;
</script>

<ModalLayout title={message}>
  <ModalContent>
    <input
      bind:this={ref}
      type="text"
      bind:value
      on:focus={() => ref.select()}
    />
  </ModalContent>
  <ModalButtonGroup>
    <Button
      variant="primary"
      on:click={() => {
        onSubmit(value);
      }}>{cta}</Button
    >
    <Button
      on:click={() => {
        onCancel();
      }}>{$i18n.t("modals.input.cancel")}</Button
    >
  </ModalButtonGroup>
</ModalLayout>

<style>
  input {
    width: 100%;
  }
</style>
