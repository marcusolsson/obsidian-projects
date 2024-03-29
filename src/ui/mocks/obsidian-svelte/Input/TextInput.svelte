<script>
  import { createEventDispatcher } from "svelte";
  import Input from "./Input.svelte";
  /**
   * Specifies the input value.
   */
  export let value;
  /**
   * Specifies whether the input is readonly.
   */
  export let readonly = false;
  /**
   * Specifies the placeholder text.
   */
  export let placeholder = "";
  /**
   * Specifies whether to focus the input when it's mounted.
   */
  export let autoFocus = false;
  /**
   * Specifies the width of the input.
   */
  export let width = "auto";
  /**
   * Specifies whether the input contains an error.
   */
  export let error = false;
  /**
   * Specifies an helper message for the input.
   */
  export let helperText = "";
  /**
   * Specifies whether to remove styles to embed the input in another
   * component.
   */
  export let embed = false;
  /**
   * Specifies whether to remove the default padding.
   */
  export let noPadding = false;
  /**
   * Specifies the reference for the underlying input element.
   */
  export let ref = null;
  const dispatch = createEventDispatcher();
  $: dispatch("input", value);
  function handleInput(event) {
    if (event.currentTarget instanceof HTMLInputElement) {
      value = event.currentTarget.value;
    }
  }
</script>

<Input
  type="text"
  bind:ref
  bind:value
  {readonly}
  {noPadding}
  {placeholder}
  {autoFocus}
  {width}
  {embed}
  {error}
  {helperText}
  on:input={handleInput}
  on:focus
  on:blur
  on:keydown
  on:keyup
/>
