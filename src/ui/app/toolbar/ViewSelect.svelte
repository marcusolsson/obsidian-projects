<script lang="ts">
  import { customViews } from "src/lib/stores/customViews";
  import type { ViewDefinition, ViewId } from "src/settings/settings";
  import { Icon, Button, IconButton } from "obsidian-svelte";
  import { i18n } from "src/lib/stores/i18n";
  import {
    dndzone,
    TRIGGERS,
    SHADOW_ITEM_MARKER_PROPERTY_NAME,
  } from "svelte-dnd-action";
  import ViewItem from "./ViewItem.svelte";
  import ShadowViewItem from "./ShadowViewItem.svelte";

  export let viewId: ViewId | undefined;
  export let views: ViewDefinition[];
  export let onViewChange: (viewId: ViewId) => void;
  export let onViewDelete: (viewId: ViewId) => void;
  export let onViewAdd: () => void;
  export let onViewDuplicate: (viewId: ViewId) => void;
  export let onViewRename: (viewId: ViewId, name: string) => void;
  export let onViewSort: (viewIds: ViewId[]) => void;
  export let viewExists: (name: string) => boolean;

  let dragItem: ViewDefinition | undefined;

  function iconFromViewType(type: string) {
    return $customViews[type]?.getIcon() ?? "";
  }

  const flipDurationMs = 200;

  function handleDndConsider({
    detail,
  }: CustomEvent<DndEvent<ViewDefinition>>) {
    if (detail.info.trigger === TRIGGERS.DRAG_STARTED) {
      dragItem = views.find((v) => v.id === detail.info.id);
    }
    views = detail.items;
  }

  function handleDndFinalize({
    detail,
  }: CustomEvent<DndEvent<ViewDefinition>>) {
    views = detail.items;
    onViewSort(detail.items.map((i) => i.id));
    if (detail.info.trigger === TRIGGERS.DROPPED_INTO_ZONE) {
      dragItem = views.find((v) => v.id === detail.info.id);
    }
    if (dragItem) {
      dragItem = undefined;
    }
  }

  function transformDraggedElement(draggedEl: HTMLElement | undefined) {
    if (draggedEl) draggedEl.empty();
  }

  function isShadowItem(view: ViewDefinition) {
    // @ts-ignore
    return view[SHADOW_ITEM_MARKER_PROPERTY_NAME];
  }
</script>

{#if views.length}
  <section
    use:dndzone={{
      type: "view-select",
      items: views,
      flipDurationMs,
      dropTargetStyle: {
        outline: "none",
      },
      morphDisabled: false,
      transformDraggedElement,
      // centreDraggedOnCursor: true,
    }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
  >
    {#each views as v (v.id)}
      {#if !isShadowItem(v)}
        <div>
          <ViewItem
            id={v.id}
            active={viewId === v.id}
            label={v.name}
            icon={iconFromViewType(v.type)}
            on:click={() => onViewChange(v.id)}
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
        </div>
      {:else}
        <div>
          <ShadowViewItem
            id={v.id}
            active={dragItem?.id === viewId}
            label={v.name}
            icon={iconFromViewType(v.type)}
          />
        </div>
      {/if}
    {/each}
    <IconButton
      icon="plus"
      size="sm"
      onClick={() => {
        onViewAdd();
      }}
      tooltip={$i18n.t("toolbar.view.add")}
    />
  </section>
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
  section {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
</style>
