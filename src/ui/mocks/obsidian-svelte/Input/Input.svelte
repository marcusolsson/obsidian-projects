<script>
  import { createEventDispatcher, onMount } from "svelte";
  /**
   * Specifies the type of input.
   */
  export let type;
  /**
   * Specifies the input value.
   */
  export let value;
  /**
   * Specifies the reference for the underlying input element.
   */
  export let ref = null;
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
   * Specifies whether to remove styles to embed the input in another
   * component.
   */
  export let embed = false;
  /**
   * Specifies whether to remove the default padding.
   */
  export let noPadding = false;
  /**
   * Specifies an message for the input.
   */
  export let helperText = "";
  const dispatch = createEventDispatcher();
  $: dispatch("input", value);
  onMount(() => {
    if (autoFocus && ref) {
      ref.focus();
    }
  });
</script>

<div style={`width: ${width}`}>
  <input
    class:error
    class:embed
    class:noPadding
    bind:this={ref}
    {value}
    {type}
    {placeholder}
    {readonly}
    on:input
    on:focus
    on:blur
    on:keydown
    on:keyup
    style={`width: ${width}`}
  />
  {#if !!helperText}
    <small class:errorText={error}>
      {helperText}
    </small>
  {/if}
</div>

<style>
  .embed {
    all: unset;
    box-sizing: border-box;
    padding: 6px;
    font-weight: 400;
    font-family: var(--font-default);
    color: var(--text-normal);
  }
  .embed:focus {
    box-shadow: none;
  }

  .noPadding {
    padding: 0;
  }

  .error {
    border-color: var(--background-modifier-error);
  }

  .error:hover {
    border-color: var(--background-modifier-error-hover);
  }

  .error:focus {
    box-shadow: 0 0 0 2px var(--background-modifier-error);
    border-color: var(--background-modifier-error);
  }

  small {
    margin-top: var(--size-4-1);
    font-size: var(--font-ui-smaller);
    color: var(--text-muted);
    display: block;
  }
  .errorText {
    color: var(--text-error);
  }
</style>
