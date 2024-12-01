<script lang="ts">
  import { produce } from "immer";
  import { Button, Icon, IconButton, TextInput } from "obsidian-svelte";
  import { dndzone } from "svelte-dnd-action";
  import { i18n } from "src/lib/stores/i18n";

  export let options: string[];
  export let onChange: (options: string[]) => void;

  type OptionItem = { id: number; value: string };
  $: optionItems = options.map((option, i) => {
    return { id: i, value: option };
  });

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

  const flipDurationMs = 200;

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

  function handleDndConsider(e: CustomEvent<DndEvent<OptionItem>>) {
    optionItems = e.detail.items;
  }

  function handleDndFinalize(e: CustomEvent<DndEvent<OptionItem>>) {
    onChange(e.detail.items.map((item) => item.value));
  }
</script>

<div>
  <div
    use:dndzone={{
      type: "multi-text",
      items: optionItems,
      flipDurationMs,
      dropTargetStyle: {
        outline: "none",
        borderRadius: "5px",
        background: "hsla(var(--interactive-accent-hsl), 0.3)",
        transition: "all 150ms ease-in-out",
      },
    }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
  >
    {#each optionItems as optionItem, i (optionItem.id)}
      <span>
        <span class="dnd-item">
          <Icon name="grip-vertical" />
          <TextInput
            width="100%"
            value={optionItem.value}
            on:blur={handleOptionChange(i)}
          />
          <IconButton icon="cross" onClick={handleOptionRemove(i)} />
        </span>
      </span>
    {/each}
  </div>
  <Button variant="plain" on:click={handleOptionAdd}>
    <Icon name="plus" />
    {$i18n.t("components.multi-text.add")}
  </Button>
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }
  .dnd-item {
    display: flex;
    gap: 4px;
    align-items: center;
  }
</style>
