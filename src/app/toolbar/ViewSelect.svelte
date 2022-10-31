<script lang="ts">
  import { customViews } from "src/lib/stores/custom-views";
  import type { ViewDefinition } from "src/types";

  import ViewItemList from "./ViewItemList.svelte";
  import ViewItem from "./ViewItem.svelte";

  export let viewId: string | undefined;
  export let views: ViewDefinition[];
  export let onViewChange: (viewId: string) => void;
  export let onViewDelete: (viewId: string) => void;
  export let onViewRename: (viewId: string, name: string) => void;
  export let viewExists: (name: string) => boolean;

  function iconFromViewType(type: string) {
    switch (type) {
      case "table":
        return "table";
      case "board":
        return "columns";
      case "calendar":
        return "calendar";
      default:
        return $customViews[type]?.()?.getIcon() ?? "";
    }
  }
</script>

<ViewItemList>
  {#key views}
    {#each views as v}
      <ViewItem
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
