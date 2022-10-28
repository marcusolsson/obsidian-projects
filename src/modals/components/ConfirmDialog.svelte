<script lang="ts">
  import {
    Button,
    Typography,
    ModalLayout,
    ModalButtonGroup,
    ModalContent,
  } from "obsidian-svelte";
  import { i18n } from "../../lib/stores/i18n";

  export let title: string;
  export let message: string;
  export let cta: string;
  export let onConfirm: () => void;
  export let onCancel: () => void;
</script>

<ModalLayout {title}>
  <ModalContent>
    <Typography variant="body">{message}</Typography>
  </ModalContent>
  <ModalButtonGroup>
    <Button
      variant={cta === $i18n.t("modals.confirm.delete")
        ? "destructive"
        : "primary"}
      on:click={() => {
        onConfirm();
      }}>{cta}</Button
    >
    <Button
      on:click={() => {
        onCancel();
      }}
    >
      {$i18n.t("modals.confirm.cancel")}
    </Button>
  </ModalButtonGroup>
</ModalLayout>
