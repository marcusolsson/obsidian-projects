<script>
  import { createEventDispatcher } from "svelte";
  /**
   * Specifies whether the checkbox is checked.
   */
  export let checked;
  /**
   * Specifies whether the checkbox is disabled.
   */
  export let disabled = false;
  let ref;
  const dispatch = createEventDispatcher();
  $: dispatch("check", checked);
  $: {
    if (ref) {
      if (checked) {
        ref.classList.add("is-enabled");
      } else {
        ref.classList.remove("is-enabled");
      }
    }
  }
</script>

<div
  class:disabled
  bind:this={ref}
  class="checkbox-container"
  on:click={() => {
    if (!disabled) {
      checked = !checked;
    }
  }}
  on:keypress
>
  <input type="checkbox" />
</div>

<style>
  .disabled {
    opacity: 0.6;
  }
</style>
