<script lang="ts">
  import { useClickOutside } from "obsidian-svelte";
  import { createEventDispatcher } from "svelte";
  import type { DataValue } from "src/lib/dataframe/dataframe";
  import { TagInput } from "./TagInput";
  import { Tag } from "./Tag";

  // determine whether duplicate tag can be accepted
  export let unique: boolean = false;
  // check invalid characters for preserved fields
  export let strict: boolean = false;
  export let invalidChars: string[] = [
    ".",
    ",",
    ";",
    ":",
    "#",
    "<",
    ">",
    "?",
    "\\",
    " ",
    " ", // ban unintentional nbsp
  ];
  export let value: DataValue[];
  let inputRef: HTMLDivElement;

  let editing: boolean = false;
  let selectedTag: number = -1; // -1 indicates that no tag is selected
  let activeInput: number = -1; // -1 indicates that no tag is being modified
  let duplicateTag: number = -1; // -1 indicates that no tag detected as duplicate

  const dispatch = createEventDispatcher();

  function onChange(newValue: DataValue, position: number) {
    if (validate(newValue.toString())) {
      value[position] = newValue;
      dispatch("change", JSON.stringify(value));
    } else {
      activeInput = -1;
    }
  }

  function onDelete(position: number) {
    value.splice(position, 1);
    dispatch("change", JSON.stringify(value));
    if (selectedTag === value.length || value.length === 0) {
      selectedTag = -1;
      inputRef.focus();
    }
  }

  function onAdd(newValue: DataValue) {
    if (validate(newValue.toString())) {
      value.push(newValue);
      dispatch("change", JSON.stringify(value));
    } else {
      activeInput = -1;
    }
  }

  function navigatePrev() {
    if (selectedTag == -1) {
      selectedTag = value.length - 1;
    } else if (selectedTag > value.length - 1 || selectedTag == 0) {
      return;
    } else {
      selectedTag -= 1;
    }
  }

  function navigateNext() {
    if (selectedTag == value.length - 1) {
      selectedTag = -1;
      inputRef.focus();
    } else if (selectedTag == -1) {
      return;
    } else {
      selectedTag += 1;
    }
  }

  const validate = (tag: string) => {
    if (!tag || tag === "") {
      return false;
    }
    if (strict && invalidChars.some((char) => tag.includes(char))) {
      return false;
    }
    if (unique && value.includes(tag)) {
      duplicateTag = value.findIndex((v) => v.toString() === tag);
      return false;
    }

    duplicateTag = -1;
    return true;
  };
</script>

<div>
  <div
    class="container"
    class:editing
    tabindex="-1"
    on:mousedown|stopPropagation={() => {}}
    on:click|stopPropagation={(event) => {
      editing = true;
      inputRef.focus();
    }}
    on:keydown|stopPropagation={() => {}}
    use:useClickOutside={() => {
      editing = false;
    }}
  >
    {#each value as eachtag, i}
      <Tag
        bind:tag={eachtag}
        selected={selectedTag === i}
        editing={activeInput === i}
        duplicate={duplicateTag === i}
        handleClick={(event) => {
          selectedTag = i;
          editing = true;
          event.stopPropagation();
        }}
        on:edit={() => {
          editing = true;
          activeInput = i;
        }}
        on:navigatePrev={navigatePrev}
        on:navigateNext={navigateNext}
        on:update={({ detail: tag }) => {
          onChange(tag, i);
        }}
        on:escape={() => {
          activeInput = -1;
        }}
        on:delete={() => {
          onDelete(i);
        }}
      />
    {/each}
    <TagInput
      value=""
      bind:ref={inputRef}
      on:focus={() => {
        selectedTag = -1;
        activeInput = -1;
        editing = true;
      }}
      on:submit={({ detail: tag }) => {
        onAdd(tag);
      }}
      on:navigatePrev={navigatePrev}
      on:escape={() => {
        activeInput = -1;
      }}
    />
  </div>
</div>

<style>
  .container {
    display: inline-flex;
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

  .editing {
    flex-wrap: wrap;
    overflow: auto;

    box-shadow: 0 0 0 2px var(--background-modifier-border-focus);
    border-color: var(--background-modifier-border-focus);
    transition: box-shadow 0.15s ease-in-out, border 0.15s ease-in-out;
  }
</style>
