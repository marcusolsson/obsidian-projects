<script lang="ts">
  import { Button, InternalLink, Typography } from "obsidian-svelte";
  import path from "path";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";

  import { isNumber, type DataRecord } from "src/lib/data";
  import Card from "../Card/Card.svelte";
  import CardList from "../Card/CardList.svelte";

  export let name: string;
  export let records: DataRecord[];
  export let groupByPriority: string | undefined;
  export let readonly: boolean;

  $: prioritized = getPrioritizedRecords(records);
  $: unprioritized = getUnprioritizedRecords(records);

  export let onRecordClick: (record: DataRecord) => void;
  export let onRecordAdd: () => void;

  function getPrioritizedRecords(records: DataRecord[]): DataRecord[] {
    return records.filter((record) => {
      return groupByPriority && isNumber(record.values[groupByPriority]);
    });
  }

  function getUnprioritizedRecords(records: DataRecord[]): DataRecord[] {
    return records.filter((record) => {
      return groupByPriority && !isNumber(record.values[groupByPriority]);
    });
  }

  function getDisplayName(record: DataRecord): string {
    const basename = path.basename(record.id);
    return basename.slice(0, basename.lastIndexOf("."));
  }
</script>

<div class="column">
  <div class="column-section">
    <Typography variant="label" nomargin>{name}</Typography>
  </div>
  {#if groupByPriority}
    {#if prioritized.length}
      <div class="column-section">
        <CardList>
          {#each prioritized as record}
            <Card on:click={() => onRecordClick(record)}>
              <InternalLink
                linkText={record.id}
                sourcePath=""
                resolved
                on:open={({ detail: { linkText, sourcePath, newLeaf } }) => {
                  if (newLeaf) {
                    $app.workspace.openLinkText(linkText, sourcePath, newLeaf);
                  } else {
                    onRecordClick(record);
                  }
                }}
              >
                {getDisplayName(record)}
              </InternalLink>
            </Card>
          {/each}
        </CardList>
      </div>
    {/if}
    {#if unprioritized.length}
      <div class="column-section unprio">
        <p>{$i18n.t("views.board.unprioritized")}</p>
        <CardList>
          {#each unprioritized as record}
            <Card on:click={() => onRecordClick(record)}>
              <InternalLink
                linkText={record.id}
                sourcePath=""
                resolved
                on:open={({ detail: { linkText, sourcePath, newLeaf } }) => {
                  if (newLeaf) {
                    $app.workspace.openLinkText(linkText, sourcePath, newLeaf);
                  } else {
                    onRecordClick(record);
                  }
                }}
              >
                {getDisplayName(record)}
              </InternalLink>
            </Card>
          {/each}
        </CardList>
      </div>
    {/if}
  {:else}
    <div class="column-section">
      <CardList>
        {#each records as record}
          <Card on:click={() => onRecordClick(record)}>
            <InternalLink
              linkText={record.id}
              sourcePath=""
              resolved
              on:open={({ detail: { linkText, sourcePath, newLeaf } }) => {
                if (newLeaf) {
                  $app.workspace.openLinkText(linkText, sourcePath, newLeaf);
                } else {
                  onRecordClick(record);
                }
              }}
            >
              {getDisplayName(record)}
            </InternalLink>
          </Card>
        {/each}
      </CardList>
    </div>
  {/if}
  {#if !readonly}
    <div class="column-section">
      <Button
        variant="plain"
        on:click={() => {
          onRecordAdd();
        }}
      >
        {$i18n.t("views.board.note.add")}
      </Button>
    </div>
  {/if}
</div>

<style>
  .column {
    border: 1px solid var(--background-modifier-border);
    border-radius: var(--radius-m);
    background-color: var(--background-secondary);
    display: flex;
    flex-direction: column;
  }

  .column-section {
    padding: var(--size-4-2);
    display: flex;
    flex-direction: column;
  }

  .unprio {
    border-top: 1px solid var(--background-modifier-border);
  }

  p {
    font-weight: 500;
    margin: 0;
    margin-bottom: 4px;
    color: var(--text-faint);
    font-size: var(--font-smaller);
  }
</style>