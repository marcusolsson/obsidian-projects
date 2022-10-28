<script lang="ts">
  import { i18n } from "src/lib/stores/i18n";
  import { Button, IconButton } from "obsidian-svelte";

  export let onNext: () => void;
  export let onPrevious: () => void;
  export let onToday: () => void;
</script>

<div>
  <IconButton icon="chevron-left" on:click={onPrevious} />
  <Button on:click={onToday}>{$i18n.t("views.calendar.today")}</Button>
  <IconButton icon="chevron-right" on:click={onNext} />
</div>

<style>
  div {
    display: flex;
    gap: 4px;
    align-items: center;
  }
</style>
