<script>
  import { createEventDispatcher } from "svelte";
  import { Suggestion, SuggestionItem } from "../Popover";
  import { TextInput } from "../Input";
  /**
   * Specifies the text input value.
   */
  export let value;
  /**
   * Specifies all valid options.
   */
  export let options;
  /**
   * Specifies the maximum number of options to display.
   */
  export let maxItems = 50;
  /**
   * Specifies whether the options popover is open.
   */
  export let open = false;
  /**
   * TextInput props
   */
  export let readonly = false;
  export let placeholder = "";
  export let width = "auto";
  export let embed = false;
  export let autoFocus = false;
  let selected = -1;
  let inputRef;
  $: filteredOptions = options
    .filter(
      (option) =>
        !value ||
        option.label.toLocaleLowerCase().contains(value.toLocaleLowerCase())
    )
    .slice(0, Math.min(maxItems, options.length));
  const dispatch = createEventDispatcher();
  let willClose = false;
  $: if (willClose) {
    open = false;
    willClose = false;
  }
</script>

<TextInput
  bind:value
  bind:ref={inputRef}
  {readonly}
  {width}
  {placeholder}
  {autoFocus}
  {embed}
  on:focus={() => (open = true)}
  on:blur={(event) => {
    open = false;
    dispatch("change", value);
    dispatch("blur", event);
  }}
  on:input={() => (open = true)}
  on:keydown={(event) => {
    if (open) {
      switch (event.key) {
        case "ArrowUp":
          const prev = selected - 1;
          selected = prev < 0 ? filteredOptions.length - 1 : prev;
          event.stopPropagation();
          break;
        case "ArrowDown":
          const next = selected + 1;
          selected = next > filteredOptions.length - 1 ? 0 : next;
          event.stopPropagation();
          break;
        case "Enter":
          value = filteredOptions[selected]?.label ?? value;
          willClose = true;
          break;
      }
    }
  }}
/>

<Suggestion anchorEl={inputRef} {open} onClose={() => (open = false)}>
  {#if !filteredOptions.length}
    <SuggestionItem label="" description="No options" />
  {/if}
  {#each filteredOptions as { label, description }, i}
    <SuggestionItem
      {label}
      {description}
      selected={selected === i}
      on:click={() => {
        value = filteredOptions[i]?.label ?? value;
        dispatch("change", value);
      }}
      on:select={({ detail }) => {
        if (detail) {
          selected = i;
        }
      }}
    />
  {/each}
</Suggestion>
