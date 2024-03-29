<script>
  import { createEventDispatcher } from "svelte";
  export let checked;
  const dispatch = createEventDispatcher();
  $: dispatch("check", checked);
  function handleChange(event) {
    if (event.currentTarget instanceof HTMLInputElement) {
      checked = event.currentTarget.checked;
    }
  }
</script>

<input
  type="checkbox"
  {checked}
  on:dblclick|stopPropagation
  on:click|stopPropagation
  on:change={handleChange}
/>
