<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import dayjs from "dayjs";

  /**
   * Specifies the date time value.
   */
  export let value: Date | null;

  /**
   * Specifies whether to remove decorations so that it can be embedded in other
   * components.
   */
  export let embed: boolean = false;

  const dispatch = createEventDispatcher<{
    change: Date | null;
    input: Date | null;
  }>();

  function handleChange(event: Event) {
    if (event.currentTarget instanceof HTMLInputElement) {
      dispatch(
        "change",
        event.currentTarget.value
          ? dayjs(event.currentTarget.value).toDate()
          : null
      );
    }
  }

  function handleInput(event: Event) {
    if (event.currentTarget instanceof HTMLInputElement) {
      dispatch(
        "input",
        event.currentTarget.value
          ? dayjs(event.currentTarget.value).toDate()
          : null
      );
    }
  }
</script>

<input
  type="datetime-local"
  class:embed
  value={value ? dayjs(value).format("YYYY-MM-DDTHH:mm") : null}
  max="9999-12-31T23:59"
  on:change={handleChange}
  on:input={handleInput}
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
