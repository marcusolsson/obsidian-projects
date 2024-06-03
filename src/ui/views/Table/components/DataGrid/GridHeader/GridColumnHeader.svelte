<script lang="ts">
  import type { Menu } from "obsidian";
  import { Icon, IconButton } from "obsidian-svelte";
  import { i18n } from "src/lib/stores/i18n";
  import { get } from "svelte/store";
  import { fieldIcon } from "src/ui/views/helpers";
  import type { GridColDef } from "../dataGrid";
  import { TextLabel } from "../GridCell";

  type GridColDefWithId = GridColDef & { readonly id: string };

  export let column: GridColDefWithId;
  export let colindex: number;

  export let onColumnMenu: (column: GridColDef) => Menu;

  function handleFieldClick(column: GridColDef): (event: MouseEvent) => void {
    return (event: MouseEvent) => {
      onColumnMenu(column).showAtMouseEvent(event);
    };
  }
</script>

<div
  role="columnheader"
  aria-colindex={colindex}
  style:width={`${column.width}px`}
  class:pinned={column.pinned}
>
  {#if column.repeated}
    {#if column.field == "tags"}
      <Icon name="tags" tooltip={get(i18n).t(`data-types.tags`) ?? ""} />
    {:else if column.field == "aliases"}
      <Icon name="forward" tooltip={get(i18n).t(`data-types.aliases`) ?? ""} />
    {:else}
      <Icon name="list" tooltip={get(i18n).t(`data-types.list`) ?? ""} />
    {/if}
  {:else}
    <Icon
      name={fieldIcon(column)}
      tooltip={get(i18n).t(`data-types.${column.type}`) ?? ""}
    />
  {/if}

  <TextLabel value={column.field} />

  <IconButton
    size="sm"
    icon="vertical-three-dots"
    onClick={handleFieldClick(column)}
  />
</div>

<style>
  div {
    position: sticky;

    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: center;

    background-color: var(--background-secondary);
    border-right: 1px solid var(--background-modifier-border);
    border-left-color: var(--background-modifier-border);
    border-bottom: 1px solid var(--background-modifier-border);

    width: 100%;
    min-height: 30px;

    font-weight: 500;
    padding: 0 4px;

    cursor: default;
  }

  div.pinned {
    border-right: 1px solid var(--background-modifier-border-focus);
  }
</style>
