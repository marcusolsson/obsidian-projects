<script lang="ts">
  import { onMount } from "svelte/internal";

  export let value: number;
  export let onChange: (value: number) => void;

  let ref: HTMLInputElement;

  function handleInput(event: Event) {
    if (event.currentTarget instanceof HTMLInputElement) {
      value = event.currentTarget.valueAsNumber;
      onChange(value);
    }
  }

  function handleKeyup(event: Event) {
    if (event.currentTarget instanceof HTMLInputElement) {
      value = event.currentTarget.valueAsNumber;
    }
  }

  onMount(() => {
    ref.focus();
  });
</script>

<input
  tabindex={-1}
  type="number"
  bind:this={ref}
  {value}
  on:change={handleInput}
  on:keypress={handleKeyup}
  on:blur
/>

<style>
  input {
    all: unset;
    background-color: var(--background-primary);
    box-sizing: border-box;
    width: 100%;
    padding: 6px;
    font-weight: 400;
    font-family: var(--font-default);
    color: var(--text-normal);
    text-align: right;
  }

  input:focus {
    box-shadow: none !important;
  }

  input:hover {
    background-color: transparent;
  }
</style>
