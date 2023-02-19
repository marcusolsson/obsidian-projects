<script lang="ts">
  import produce from "immer";
  import { Button, FileAutocomplete, IconButton } from "obsidian-svelte";

  import { getFilesInFolder } from "src/lib/obsidian";
  import { app } from "src/lib/stores/obsidian";

  export let paths: string[];
  export let onPathsChange: (value: string[]) => void;
  export let buttonText: string;
</script>

{#each paths as path, i}
  <div class="projects-field-list-input">
    <FileAutocomplete
      value={path}
      on:change={({ detail: value }) => {
        onPathsChange(
          produce(paths, (draft) => {
            draft[i] = value;
            return draft;
          })
        );
      }}
      files={getFilesInFolder($app.vault.getRoot())}
      getLabel={(file) => file.path}
      width="100%"
    />
    <IconButton
      icon="x"
      on:click={() => {
        onPathsChange(paths.filter((_, j) => j !== i));
      }}
    />
  </div>
{/each}

<Button
  on:click={() => {
    onPathsChange([...paths, ""]);
  }}>{buttonText}</Button
>

<style>
  .projects-field-list-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
    padding-bottom: 4px;
    width: 100%;
  }

  .projects-field-list-input:first-child {
    flex: 1;
  }
</style>
