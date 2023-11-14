<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let ref: HTMLDivElement;

  export let value: string;
  const rollback = value;

  const reset = () => {
    value = "";
  };

  const dispatch = createEventDispatcher<{
    input: string;
    submit: string;
    focus: FocusEvent;
    escape: void;
    navigatePrev: void;
  }>();
  $: dispatch("input", value);
</script>

<div
  contenteditable="true"
  bind:textContent={value}
  bind:this={ref}
  on:click={(event) => {
    event.stopPropagation();
  }}
  on:focus={(event) => {
    if (value !== "" && event.target instanceof Node) {
      window.getSelection()?.selectAllChildren(event.target); // The second condition is used for type assertion
    }
    dispatch("focus", event);
  }}
  on:keydown={(event) => {
    if (value === "") {
      switch (event.key) {
        case "Enter":
          event.preventDefault();
          break;
        case "ArrowLeft":
          dispatch("navigatePrev");
          break;
        case "ArrowUp":
          dispatch("navigatePrev");
          break;
        case "Backspace":
          dispatch("navigatePrev");
          break;
        case "Escape":
          dispatch("escape");
          break;
      }
      return;
    } else {
      switch (event.key) {
        case "Enter":
          event.preventDefault();
          if (value == rollback) {
            dispatch("escape");
          } else {
            dispatch("submit", value);
            reset();
          }
          break;
        case "Escape":
          dispatch("escape");
          value = rollback;
          break;
      }
    }
  }}
  on:blur={() => {
    if (value == rollback) {
      dispatch("escape");
    } else {
      dispatch("submit", value);
      reset();
    }
  }}
/>

<style>
  div {
    min-width: 1px;
    max-width: max-content;
    box-sizing: border-box;

    cursor: text;
    font-family: var(--font-interface);
    color: var(--text-normal);
    background-color: transparent;
    border: none;
    overflow-x: auto;
    white-space: nowrap;
  }
</style>
