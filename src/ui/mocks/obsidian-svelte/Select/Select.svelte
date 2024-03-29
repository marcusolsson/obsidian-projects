<script>
  import { createEventDispatcher } from "svelte";
  import SelectItem from "./SelectItem.svelte";
  /**
   * Specifies the available options.
   */
  export let options;
  /**
   * Specifies the selected value.
   */
  export let value;
  /**
   * Specifies the placeholder text.
   */
  export let placeholder = "";
  /**
   * Specifies whether to allow empty values.
   */
  export let allowEmpty = false;
  /**
   * Specifies whether the select is disabled.
   */
  export let disabled = false;
  /**
   * Specifies the tooltip.
   */
  export let tooltip = "";
  const dispatch = createEventDispatcher();
  function handleChange(event) {
    if (event.currentTarget instanceof HTMLSelectElement) {
      dispatch("change", event.currentTarget.value);
    }
  }
</script>

<select
  aria-label={tooltip}
  disabled={disabled || (!options.length && !!placeholder)}
  class="dropdown"
  {value}
  on:change={handleChange}
>
  {#if !options.length && placeholder}
    <SelectItem text={placeholder} value="" disabled />
  {/if}
  {#if allowEmpty}
    <SelectItem text={placeholder} value="" />
  {/if}
  {#each options as option}
    <SelectItem text={option.label} value={option.value} />
  {/each}
</select>
