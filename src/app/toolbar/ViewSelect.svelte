<script lang="ts">
  import { customViews } from "src/lib/stores/custom-views";
  import type { ViewDefinition } from "src/types";

  import ViewItem from "./ViewItem.svelte";
  import ViewItemList from "./ViewItemList.svelte";

  export let viewId: string | undefined;
  export let views: ViewDefinition[];
  export let onViewChange: (viewId: string) => void;
  export let onViewDelete: (viewId: string) => void;
  export let onViewDuplicate: (viewId: string) => void;
  export let onViewRename: (viewId: string, name: string) => void;
  export let onViewSort: (viewIds: string[]) => void;
  export let viewExists: (name: string) => boolean;

  function iconFromViewType(type: string) {
    return $customViews[type]?.getIcon() ?? "";
  }
</script>

<ViewItemList onSort={onViewSort}>
  {#key views}
    {#each views as v}
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
