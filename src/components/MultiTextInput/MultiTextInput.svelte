<script lang="ts">
  import produce from "immer";
  import { Button, Icon, IconButton, TextInput } from "obsidian-svelte";

  export let options: string[];
  export let onChange: (options: string[]) => void;

  function handleOptionAdd() {
    onChange(
      produce(options, (draft) => {
        draft.push("");
      })
    );
  }

  function handleOptionRemove(i: number) {
    return () => {
      onChange(
        produce(options, (draft) => {
          draft.splice(i, 1);
        })
      );
    };
  }

  function handleOptionChange(i: number) {
    return (event: FocusEvent) => {
      if (event.currentTarget instanceof HTMLInputElement) {
        onChange(
          produce(options, (draft) => {
            if (event.currentTarget instanceof HTMLInputElement) {
              draft.splice(i, 1, event.currentTarget.value);
            }
          })
        );
      }
    };
  }
</script>

<div>
  {#each options as option, i}
    <span>
      <TextInput width="100%" value={option} on:blur={handleOptionChange(i)} />
      <IconButton icon="cross" on:click={handleOptionRemove(i)} />
    </span>
  {/each}
  <Button variant="plain" on:click={handleOptionAdd}
    ><Icon name="plus" />Add an option</Button
  >
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }
  span {
    display: flex;
    gap: 4px;
  }
</style>
