<script lang="ts">
  import { customViews } from "src/lib/stores/customViews";
  import type { ViewDefinition, ViewId } from "src/settings/settings";
  import { Icon, Button, IconButton } from "obsidian-svelte";
  import { i18n } from "src/lib/stores/i18n";

  import ViewItem from "./ViewItem.svelte";
  import ViewItemList from "./ViewItemList.svelte";

  export let viewId: ViewId | undefined;
  export let views: ViewDefinition[];
  export let onViewChange: (viewId: ViewId) => void;
  export let onViewDelete: (viewId: ViewId) => void;
  export let onViewAdd: () => void;
  export let onViewDuplicate: (viewId: ViewId) => void;
  export let onViewRename: (viewId: ViewId, name: string) => void;
  export let onViewSort: (viewIds: ViewId[]) => void;
  export let viewExists: (name: string) => boolean;

  function iconFromViewType(type: string) {
    return $customViews[type]?.getIcon() ?? "";
  }
</script>

{#if views.length}
  <span>
    <ViewItemList onSort={onViewSort}>
      {#key views}
        {#each views as v (v.id)}
          <ViewItem
            id={v.id}
            active={viewId === v.id}
            label={v.name}
            icon={iconFromViewType(v.type)}
            on:mousedown={() => onViewChange(v.id)}
            on:rename={({ detail: name }) => {
              onViewRename(v.id, name);
            }}
            on:delete={() => {
              onViewDelete(v.id);
            }}
            on:duplicate={() => {
              onViewDuplicate(v.id);
            }}
            onValidate={(name) => {
              // Check if view has it's original name.
              if (name === v.name) {
                return true;
              }

              return name !== "" && !viewExists(name);
            }}
          />
        {/each}
      {/key}
    </ViewItemList>
    <IconButton
      icon="plus"
      size="sm"
      onClick={() => {
        onViewAdd();
      }}
      tooltip={$i18n.t("toolbar.view.add")}
    />
  </span>
{:else}
  <Button
    variant="plain"
    on:click={() => {
      onViewAdd();
    }}
  >
    <Icon name="plus" size="sm" />
    {$i18n.t("toolbar.view.add")}
  </Button>
{/if}

<style>
  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
</style>
