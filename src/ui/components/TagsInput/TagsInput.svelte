<script lang="ts">
  import { Tag, IconButton } from "obsidian-svelte";
  import type { DataValue, Optional } from "src/lib/dataframe/dataframe";
  import { createEventDispatcher } from "svelte";

  export let unique: boolean = false; // determine whether duplicated tag can be accepted
  export let strict: boolean = false; // check invalid characters for preserved fields

  export let value: Optional<DataValue>[];

  let ref: HTMLDivElement;
  let tag: string = "";

  let editing: boolean = false;

  $: error = !onValidate(tag);
  const onValidate = (tag: string) => {
    if (!tag || tag === "") return false;

    // invalid chars, can be used as delimeter
    if (strict)
      if (tag.contains(",") || tag.contains(" ") || tag.contains("."))
        return false; // show error hint

    // duplicated tags
    if (unique) if (value.includes(tag)) return false; // highlight existing one, visual hint

    return true;
  };

  const dispatch = createEventDispatcher();
  function onChange(value: Optional<DataValue>[]) {
    dispatch("change", JSON.stringify(value));
  }
</script>

<div>
  <div
    class="container"
    class:editing
    tabindex="-1"
    on:focus={(evt) => {
      ref.focus();
      editing = true;
    }}
  >
    {#each value as eachtag}
      <Tag>
        {eachtag}
        <IconButton
          icon="cross"
          size="xs"
          nopadding
          onClick={(evt) => {
            evt.stopPropagation();
            value = value.filter((value) => value !== eachtag);
          }}
        />
      </Tag>
    {/each}
    <div
      class="input"
      contenteditable="true"
      bind:textContent={tag}
      bind:this={ref}
      on:keydown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();

          if (tag == "") {
            editing = false;
            onChange(value);
          }
          if (!error) value.push(tag);

          value = value; // force update
          tag = "";
        }
        if (event.key === "Escape") {
          editing = false;
          onChange(value);
          tag = "";
        }
        if (event.key === "Backspace" && tag === "") {
          value.pop();
          value = value; // force update
        }
        // navigate & focus, prev & next
      }}
      on:blur={() => {
        editing = false;
        if (!error) {
          value.push(tag);
        }
        onChange(value);
      }}
    />
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-wrap: nowrap;

    gap: var(--size-4-1);
    overflow: hidden;
    padding: var(--size-4-1) var(--size-4-2);
    outline: none;

    align-items: center;
    vertical-align: top;

    width: 121pt; /*default width of input element*/
    min-height: var(--input-height);
    cursor: text;
    background: var(--background-modifier-form-field);
    border: var(--input-border-width) solid var(--background-modifier-border);
    border-radius: var(--input-radius);
    color: var(--text-normal);
    font-size: var(--font-ui-small);
  }

  .container:focus-within {
    box-shadow: 0 0 0 2px var(--background-modifier-border-focus);
    border-color: var(--background-modifier-border-focus);
    transition: box-shadow 0.15s ease-in-out, border 0.15s ease-in-out;
  }

  .input {
    min-width: 1ch;
    max-width: max-content;
    box-sizing: border-box;

    cursor: text;
    font-family: var(--font-interface);
    color: var(--text-normal);
    background-color: inherit;
    border: none;
    overflow-x: auto;
    white-space: nowrap;
  }

  .editing {
    flex-wrap: wrap;
    overflow: auto;
  }
</style>
