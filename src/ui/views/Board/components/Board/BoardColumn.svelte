<script lang="ts">
  import { Button, Typography, Icon } from "obsidian-svelte";
  import { i18n } from "src/lib/stores/i18n";

  import type { DataRecord, DataField } from "src/lib/dataframe/dataframe";
  import CardGroup from "./CardList.svelte";

  export let name: string;
  export let records: DataRecord[];
  export let readonly: boolean;
  export let onDrop: (records: DataRecord[]) => void;
  export let includeFields: DataField[];

  export let onRecordClick: (record: DataRecord) => void;
  export let onRecordAdd: () => void;
</script>

<section data-id={name} class="projects--board--column">
  <Typography variant="label" nomargin>{name}</Typography>
  <CardGroup items={records} {onRecordClick} {onDrop} {includeFields} />
  {#if !readonly}
    <Button variant="plain" on:click={() => onRecordAdd()}>
      <Icon name="plus" />
      {$i18n.t("views.board.note.add")}
    </Button>
  {/if}
</section>
