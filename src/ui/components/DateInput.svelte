<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Temporal } from "temporal-polyfill";

  /**
   * Specifies the date value.
   */
  export let value: Temporal.PlainDate | null;

  /**
   * Specifies whether to remove decorations so that it can be embedded in other
   * components.
   */
  export let embed: boolean = false;

  const dispatch = createEventDispatcher<{
    change: Temporal.PlainDate | null;
    input: Temporal.PlainDate | null;
  }>();

  function handleChange(event: Event) {
    if (event.currentTarget instanceof HTMLInputElement) {
      dispatch(
        "change",
        event.currentTarget.value
          ? Temporal.PlainDate.from(event.currentTarget.value)
          : null
      );
    }
  }
</script>

<input
  type="date"
  class:embed
  value={value ? value.toString() : null}
  max="9999-12-31"
  on:change={handleChange}
  on:blur
/>

<style>
  input {
    border-radius: 9999px;
    border: 0;
    background-color: var(--background-modifier-hover);
    font-family: var(--font-default);
    padding-left: var(--size-4-6);
  }

  .embed {
    margin: 0 8px;
  }
</style>
