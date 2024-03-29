<script>
  import { createEventDispatcher } from "svelte";
  export let value;
  export let rows;
  export let width = "auto";
  export let placeholder = "";
  const dispatch = createEventDispatcher();
  $: dispatch("input", value);
</script>

<textarea bind:value {rows} style={`width: ${width}`} {placeholder} />

<style>
  textarea {
    font-family: var(--font-monospace-default);
  }
</style>
